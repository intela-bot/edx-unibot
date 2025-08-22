Frontend
--------

Frontend part of the AI TA Plugin interface that provides the UI.

The stack we use is:
1. [React](https://reactjs.org/)
2. [react-router v6](https://reactrouter.com/en/main) for routing
3. [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for state management
4. [vite.js](https://vitejs.dev/) as a build tool
5. [ESLint](https://eslint.org/) for linting JavaScript code
5. [Stylelint](https://stylelint.io/) for linting CSS/SCSS styles


# Application interface
- the app mounts to the external page to the element with `uni-tab-root`
  identifier;
- the wrapper app takes React app bundle from `dist/uni_bot/bundle.js`;
- the wrapper app takes styles from `dist/uni_bot/styles.css`.
