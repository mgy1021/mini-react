import React from "./React.js";
const ReactDOM = {
  createRoot (dom) {
    return {
      render: (app) => {
        React.render(app, dom)
      }
    }
  }
}

export default ReactDOM