# AI

Aether's AI can talk about your code, finish your lines, change code for you, and use Aether's own tools. It runs on your PC (private and free) or in the cloud with your own key.

## Open it

**Ctrl+Shift+A** (**AI > AI: Toggle Chat Panel**) opens the AI panel. Ask anything about your code: the open file is part of the question.

## On your PC

Install [Ollama](https://ollama.com) or [LM Studio](https://lmstudio.ai), and download a model. Aether finds them by itself; **AI > AI: Detect Local Models** looks again, and **AI > AI: Start Ollama** starts Ollama for you. Nothing leaves your PC.

## In the cloud, with your own key

**Settings > AI** (or the key button in the AI panel) takes keys for Claude, OpenAI (with the Codex models), Gemini, OpenRouter, Groq, Mistral, DeepSeek and xAI Grok.

- Each key is checked when you save it.
- Keys are locked with your system's keychain, are never written to settings, and are never exported. Aether only ever shows their last four characters.
- **Claude Code** and **Codex** work with your Claude or ChatGPT plan, with no key: install them and sign in from Settings > AI.
- If a service says no (a wrong key, no credit, a model that does not exist), Aether says so plainly.

## What it can do

From the **AI** menu, or right-click in the code:

- **Explain Code**, **Find Bugs**, **Write Tests**, **Add Documentation Comments**, **Refactor Selection**.
- **Edit Selection with Instruction** (**Ctrl+Alt+E**): say what to change, and only those lines change. The change shows in red and green, and one **Ctrl+Z** undoes it.
- **Fix Problems in File**: fixes what Problems lists.
- **Write Commit Message** from your changes.
- **Autocomplete**: grey text that finishes your line; press **Tab** to take it. **AI > AI: Toggle Autocomplete** switches it. With a cloud model it is off until you turn it on, because each suggestion is a paid request.

The AI can also **make and change files**. Every change comes as a card: look at it with **Diff**, and press **Apply** to make it. Nothing is written without your click, and only inside your project folder.

## The AI can use Aether

Ask it to open a tool, make a sprite, make a picture, turn an image into pixel art, make and run a game, open a file, search the web, change the theme or a setting, or start the focus timer. Each action is a card with a **Run** button. Safe ones can run by themselves if you want, but a terminal command always waits for your click.

## Pictures

**Create > Open AI Image Studio** makes pictures with Stable Diffusion on your own graphics card. **Enhance** turns a short idea into a detailed prompt, and **Surprise me** gives you an idea.

## Build games with Claude

In the game engine, **Game > Connect Claude** sets up your game folder, so Claude Code there can read the engine's guide, look at your scenes, change them and test the game. You see every change in Aether as it happens.
