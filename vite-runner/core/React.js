function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof (child) === "string") {
          return createTextNode(child)
        }
        return child
      })
    }
  }
}

function createTextNode (text) {
  return {
    type: 'EL-TEXTNODE',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render (el, containner) {
  nextWorkOfUnit = {
    dom: containner,
    props: {
      children: [el]
    }
  }

  // 1.根据类型创建dom
  // const dom = el.type !== 'EL-TEXTNODE' ? document.createElement(el.type) : document.createTextNode('')

  // 2.处理props
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key]
  //   }
  // })

  // 3.处理子节点children
  // const children = el.props.children
  // children.forEach(child => {
  //   render(child, dom)
  // });

  // 4.把构建好的DOM树加入的准备好的容器containner中
  // containner.append(dom)
}

let nextWorkOfUnit = null
function workLoop (deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    // run task
    nextWorkOfUnit = perfromWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

function createDom (type) {
  return type !== 'EL-TEXTNODE' ? document.createElement(type) : document.createTextNode('')
}

function updatedProps (dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren (fiber) {
  const children = fiber.props.children
  let preChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      preChild.sibling = newFiber
    }
    preChild = newFiber
  })
}

function perfromWorkOfUnit (fiber) {
  // 1.创建dom
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)
    // 把dom树加载的容器中
    fiber.parent.dom.append(dom)

    // 2.处理props
    updatedProps(dom, fiber.props)
  }

  // 3.调整链表
  initChildren(fiber)

  // 4.返回下一个任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

requestIdleCallback(workLoop)


const React = {
  createElement,
  render
}

export default React

