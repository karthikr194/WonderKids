<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1OFk-w7wA3rUOyAGZbYOLLytLWX8jSr9a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Guided learning

The home screen has English and Phonics learning sections alongside the existing games.

- **English:** greetings, naming words, action words, and first sentences.
- **Phonics:** six introductory sounds (`s a t p i n`), followed by blending `sat`, `pin`, and `tap`.
- Every lesson follows **Learn → Together → Your turn**, with retry hints and a next-lesson action after a correct answer. All lessons remain available for review.
- Completion is saved on this device, separately for each subject and name/age combination. Enter the same name and age after reloading to resume. This is local progress, not an authenticated child account or cross-device sync. Learning completion is separate from game stars.
- Browser speech reads instructions and whole example words. It does **not** model isolated phonemes; a grown-up models those using the on-screen mouth-position and pure-sound guidance. Audio availability and pronunciation depend on device voices. Recorded, educator-reviewed phonemes are a future enhancement.
- Lessons work as text if speech is unavailable. If browser storage is blocked, completion remains available for the current session and the app explains that it could not save it.

### Validation

```sh
npm ci
npm run typecheck
npm test
npm run build
```

The component test covers teaching order, incorrect-answer hints, completion and replay, navigation, blending letter selection, persistence, English lessons, speech cancellation, and storage/audio fallbacks.

Before release, verify the mobile layout and keyboard navigation in a browser, and listen to teaching instructions and example words on the target Android/iOS devices. Review isolated sound modelling with an educator. A browser smoke test could not run in the implementation workspace because Chromium process startup was blocked by the host.
