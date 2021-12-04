/*!
  @author Mohamed Muntasir
  @link https://github.com/devmotheg
  */

const BODY_EL = document.querySelector("body"),
  TODO_INPUT_EL = document.querySelector("input"),
  TODO_BODY_EL = document.querySelector(".todo__body"),
  TODO_CHECKBOX_EL = document.querySelector(".todo__checkbox"),
  SPANS_EL = document.querySelectorAll("span");

TODO_INPUT_EL.addEventListener("keyup", e => {
  if (e.key === "Enter" && TODO_INPUT_EL.value !== "") {
    const TODO_ITEM_EL = createTodoElement(TODO_INPUT_EL.value);
    TODO_INPUT_EL.value = "";
    if (SPANS_EL[0].classList.contains("--hidden")) {
      TODO_BODY_EL.appendChild(TODO_ITEM_EL);
    } else {
      TODO_BODY_EL.insertBefore(TODO_ITEM_EL, TODO_BODY_EL.children[0]);
    }
  }
});

TODO_BODY_EL.addEventListener("click", e => {
  if (e.target.classList.contains("toggle")) {
    e.target.classList.toggle("--done");
    e.target.parentNode.classList.toggle("--done");
  } else if (e.target.classList.contains("delete")) {
    e.target.parentNode.remove();
  }
});

TODO_CHECKBOX_EL.addEventListener("click", () => {
  for (const ELE of SPANS_EL) {
    ELE.classList.toggle("--hidden");
  }
});

function grab() {
  TODO_BODY_EL.addEventListener("mousedown", e1 => {
    let shift = 0;
    if (e1.target.classList.contains("todo__item")) {
      e1.target.classList.add("--grabbing");
      BODY_EL.classList.add("--grabbing");
      const CONTROLLER = new AbortController();

      e1.target.addEventListener(
        "mousemove",
        e2 => {
          const CURR_X = e2.clientX - e1.clientX,
            CURR_Y = e2.clientY - e1.clientY;
          e1.target.style.transform = `translate(${CURR_X}px, ${CURR_Y}px)`;
          shift = Math.floor(CURR_Y / 60);
        },
        { signal: CONTROLLER.signal }
      );

      "mouseleave mouseup".split(" ").forEach(cE => {
        e1.target.addEventListener(
          cE,
          () => {
            e1.target.classList.remove("--grabbing");
            BODY_EL.classList.remove("--grabbing");
            e1.target.style.transform = "";
            let CHILDREN = TODO_BODY_EL.children,
              LENGTH = CHILDREN.length;
            for (let i = 0; i < LENGTH; i++) {
              if (CHILDREN[i] === e1.target) {
                e1.target.remove();
                TODO_BODY_EL.insertBefore(
                  e1.target,
                  CHILDREN[Math.max(i + shift, 0)]
                );
                break;
              }
            }
            CONTROLLER.abort();
          },
          { signal: CONTROLLER.signal }
        );
      });
    }
  });
}

function createTodoElement(inputValue) {
  const TODO_ITEM_EL = document.createElement("li"),
    TODO_PARAGRAPH_EL = document.createElement("p"),
    CROSS_EL = document.createElement("span");
  TODO_ITEM_EL.classList.add("todo__item");
  TODO_PARAGRAPH_EL.textContent = inputValue;
  TODO_PARAGRAPH_EL.classList.add("toggle");
  CROSS_EL.innerHTML = "&times;";
  CROSS_EL.classList.add("delete");
  TODO_ITEM_EL.appendChild(TODO_PARAGRAPH_EL);
  TODO_ITEM_EL.appendChild(CROSS_EL);
  return TODO_ITEM_EL;
}

grab();
