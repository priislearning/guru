import { useTutorStore } from "../store/useTutorStore";
import { sendChatMessage } from "./api";
import { audioPlayer } from "./audioPlayer";
import { BoardAction, TutorTurn } from "../types/tutor";

class TutorOrchestrator {
  private activeTimers: NodeJS.Timeout[] = [];

  /**
   * Clears any pending board action sync timers
   */
  private clearTimers() {
    this.activeTimers.forEach((t) => clearTimeout(t));
    this.activeTimers = [];
  }

  /**
   * Executes a full tutor turn:
   * 1. Status -> 'thinking'
   * 2. Call backend proxy (/api/tutor/chat)
   * 3. Update emotion & gesture
   * 4. Play TTS audio and sync board actions at sync_at
   * 5. Set demo & question
   */
  async handleUserInput(userText: string) {
    const store = useTutorStore.getState();

    // Immediately stop any prior speech and clear sync timers
    this.clearTimers();
    audioPlayer.stop();
    store.setQuestionOpen(false);
    store.setQuestionResult(null);

    // 1. Add user message to conversation history
    store.addMessage({
      id: "user-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date(),
    });

    store.setAvatarStatus("thinking");
    store.setEmotion("thinking");
    store.setGesture("none");

    try {
      // Build conversation context
      const history = store.messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const response = await sendChatMessage({
        topic: store.topic,
        language: store.language,
        message: userText,
        conversationHistory: history,
        userProfile: store.userProfile,
        teachingStyle: store.teachingStyle,
        lastQuestion: store.currentQuestion,
      });

      if (response.success && response.turn) {
        await this.playTutorTurn(response.turn, response.audio?.audioBase64);
      } else {
        throw new Error(response.error || "Failed to generate tutor turn");
      }
    } catch (err: any) {
      console.error("Orchestrator error:", err);
      store.setAvatarStatus("idle");
      store.setEmotion("concerned");
      store.addMessage({
        id: "err-" + Date.now(),
        sender: "tutor",
        text: "I encountered a brief hiccup, but I am right here. Please try asking again!",
        timestamp: new Date(),
        emotion: "concerned",
      });
    }
  }

  /**
   * Plays tutor turn with speech audio, synced whiteboard, and demo activation
   */
  async playTutorTurn(turn: TutorTurn, audioBase64?: string | null) {
    const store = useTutorStore.getState();
    this.clearTimers();

    // 1. Set avatar emotion and gesture
    store.setEmotion(turn.emotion || "happy");
    store.setGesture(turn.gesture || "none");
    store.setCurrentSubtitle(turn.speech);

    // 2. Add tutor message to chat
    store.addMessage({
      id: "tutor-" + Date.now(),
      sender: "tutor",
      text: turn.speech,
      timestamp: new Date(),
      emotion: turn.emotion,
    });

    // 3. Set avatar to speaking
    store.setAvatarStatus("speaking");

    // 4. Track executed actions
    const executedActions = new Set<number>();
    const actions = turn.board_actions || [];

    // Clear previous board when fresh diagrams arrive
    if (actions.length > 0) {
      store.clearBoard();
    }

    // Dynamic whiteboard parallel pacing: distribute board actions across whole speech duration
    const numActions = actions.length;
    const calibrateSyncTime = (index: number, totalDuration: number) => {
      if (numActions <= 1) return Math.min(1.2, totalDuration * 0.3);
      // Start drawing ~12% in, finish drawing last element ~85% into speech
      const fraction = 0.12 + (index / (numActions - 0.2)) * 0.74;
      return Math.max(0.6, totalDuration * fraction);
    };

    const executeAction = (action: BoardAction, index: number) => {
      if (!executedActions.has(index)) {
        executedActions.add(index);
        if (action.type === "erase") {
          store.clearBoard();
        } else {
          store.addBoardAction(action);
          // Guru actively gestures to the whiteboard when drawing
          store.setGesture("point_board");
          const gestureTimer = setTimeout(() => {
            if (useTutorStore.getState().avatarStatus === "speaking") {
              useTutorStore.getState().setGesture("nod");
            }
          }, 1800);
          this.activeTimers.push(gestureTimer);
        }
      }
    };

    // 5. Completion handler - called ONLY when the whole teaching speech is 100% finished
    const onSpeechComplete = () => {
      // Ensure all remaining board actions are executed
      actions.forEach((act, idx) => executeAction(act, idx));

      // Append summary notes if any
      if (turn.summary_notes && turn.summary_notes.length > 0) {
        turn.summary_notes.forEach((note) => store.addSummaryNote(note));
      }

      // Update mastery score if specified
      if (turn.mastery_update) {
        store.updateMastery(turn.mastery_update.concept, turn.mastery_update.delta);
      }

      // Activate demo if present
      if (turn.demo) {
        store.setActiveDemo(turn.demo);
      }

      // Mark avatar idle and gesture complete
      store.setAvatarStatus("idle");
      store.setGesture("none");

      // Multiple choice questions appear ONLY after the whole teaching is done + 2.5s pause
      // so the learner has time to absorb the completed whiteboard diagram!
      if (turn.question) {
        store.setCurrentQuestion(turn.question);
        store.setQuestionResult(null);
        const questionTimer = setTimeout(() => {
          // Verify avatar is truly idle and not in a new speech turn
          if (useTutorStore.getState().avatarStatus === "idle") {
            store.setQuestionOpen(true);
          }
        }, 2500);
        this.activeTimers.push(questionTimer);
      }
    };

    // 6. Play audio if available with authoritative Web Audio callbacks
    if (audioBase64) {
      try {
        const audioDurationSec = await audioPlayer.playAudio(
          audioBase64,
          () => {
            onSpeechComplete();
          },
          (currentTimeSec: number) => {
            // Draw each action at its calibrated parallel timestamp
            actions.forEach((act, idx) => {
              const targetTime = calibrateSyncTime(idx, audioDurationSec);
              if (currentTimeSec >= targetTime) {
                executeAction(act, idx);
              }
            });
          }
        );

        // Generous safety timer only in case Web Audio onended is dropped by browser: duration + 6s
        const safeTimeoutMs = Math.max(8000, (audioDurationSec + 6) * 1000);
        const safetyTimer = setTimeout(() => {
          if (useTutorStore.getState().avatarStatus === "speaking") {
            onSpeechComplete();
          }
        }, safeTimeoutMs);
        this.activeTimers.push(safetyTimer);
      } catch (audioErr) {
        console.warn("Audio playback exception, falling back to simulated speech timer:", audioErr);
        const durationSec = Math.max(5, turn.speech.length * 0.12);
        actions.forEach((act, idx) => {
          const delayMs = calibrateSyncTime(idx, durationSec) * 1000;
          const timer = setTimeout(() => executeAction(act, idx), delayMs);
          this.activeTimers.push(timer);
        });
        const finishTimer = setTimeout(onSpeechComplete, durationSec * 1000);
        this.activeTimers.push(finishTimer);
      }
    } else {
      // Simulate playback timing: ~10 chars/sec
      const durationSec = Math.max(5, turn.speech.length * 0.11);

      actions.forEach((act, idx) => {
        const delayMs = calibrateSyncTime(idx, durationSec) * 1000;
        const timer = setTimeout(() => executeAction(act, idx), delayMs);
        this.activeTimers.push(timer);
      });

      const finishTimer = setTimeout(onSpeechComplete, durationSec * 1000);
      this.activeTimers.push(finishTimer);
    }
  }
}

export const tutorOrchestrator = new TutorOrchestrator();
