import { Show,createSignal,onMount,onCleanup,For,createEffect } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import IconEnv from './icons/Env'
import type {PromptItem} from './Generator'


interface Props {
  prompt:Accessor< PromptItem[]>
  changeInput:(s:string)=>void
  hover: boolean
}


export default (props: Props) => {



  const [hoverIndex, setHoverIndex] = createSignal(0)

  const [maxHeight, setMaxHeight] = createSignal("320px")

  function listener(e: KeyboardEvent) {

      if (e.key === "ArrowDown") {
        setHoverIndex(hoverIndex() + 1)
      } else if (e.key === "ArrowUp") {
        setHoverIndex(hoverIndex() - 1)
      } else if (props.prompt()[hoverIndex()]?.prompt&&e.key === "Enter") {
        props.changeInput(props.prompt()[hoverIndex()].prompt)
          e.preventDefault()
      }


  }

  let containerRef: HTMLUListElement


  const itemClick=(k:string)=>{
    props.changeInput(k)
  }
  createEffect(() => {
    if (hoverIndex() < 0) {
      setHoverIndex(0)
    } else if (hoverIndex() && hoverIndex() >= props.prompt().length) {
      setHoverIndex(props.prompt().length - 1)
    }
  })

  createEffect(() => {
    if (containerRef && props.prompt().length)
      setMaxHeight(
          `${
              window.innerHeight - containerRef.clientHeight > 112
                  ? 320
                  : window.innerHeight - 112
          }px`
      )
  })

  onMount(() => {
    window.addEventListener("keydown", listener)
  })
  onCleanup(() => {
    window.removeEventListener("keydown", listener)
  })
  return (
      <ul
          ref={containerRef!}
          class="bg-slate bg-op-15 dark:text-slate text-slate-7 overflow-y-auto rounded-t"
          style={{
            "max-height": maxHeight()
          }}
      >
        <For each={props.prompt()}>
          {(prompt, i) => (
              <Item
                  prompt={prompt}
                  select={itemClick}
                  hover={hoverIndex() === i()}
              />
          )}
        </For>
      </ul>
  )
}

function Item(props: {
  prompt:  PromptItem
  hover: boolean
  select:(s:string)=>void
}) {
  let ref: HTMLLIElement
  createEffect(() => {
    if (props.hover) {
      ref.focus()
      ref.scrollIntoView({ block: "center" })
    }
  })
  return (
      <li
          ref={ref!}
          class="hover:bg-slate hover:bg-op-20 py-1 px-3"
          classList={{
            "bg-slate": props.hover,
            "bg-op-20": props.hover
          }}
          onClick={() => {
            props.select(props.prompt.prompt)
          }}
      >
        <p>{props.prompt.desc}</p>
        <p class="text-0.4em">{props.prompt.prompt}</p>
      </li>
  )
}