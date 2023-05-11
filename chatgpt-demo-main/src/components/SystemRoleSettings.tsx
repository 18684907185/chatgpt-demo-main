import { Show,createSignal,onMount,onCleanup,For,createEffect } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import IconEnv from './icons/Env'
import type {PromptItem} from './Generator'
import PromptList from "./PromptList";
import { Fzf } from "fzf"

interface Props {
  canEdit: Accessor<boolean>
  systemRoleEditing: Accessor<boolean>
  setSystemRoleEditing: Setter<boolean>
  currentSystemRoleSettings: Accessor<string>
  setCurrentSystemRoleSettings: Setter<string>
  promptFromG:Accessor< PromptItem[]>
}


export default (props: Props) => {
  let systemInputRef: HTMLTextAreaElement

  const originPrompts=props.promptFromG()

  const fzf = new Fzf(originPrompts, {
    selector: k => `${k.desc} (${k.prompt})`
  })
  const [showPrompt, setShowPrompt] = createSignal(false)
  const [hasValue, setHasValue] = createSignal(false)
  const [prompt, setPrompt] = createSignal<PromptItem[]>([])

  setPrompt(originPrompts)
  function listener(e: KeyboardEvent) {
    if(props.systemRoleEditing()){
       if(e.key===" "){
        setShowPrompt(true)
        e.preventDefault()
      }
    }

  }

  const handleButtonClick = () => {
    props.setCurrentSystemRoleSettings(systemInputRef.value)
    props.setSystemRoleEditing(false)
    setShowPrompt(false)
    setPrompt(originPrompts)
  }
  const showPreset=()=>{
    setShowPrompt(true)
    setPrompt(originPrompts)
  }
  const clearRole=()=>{
    systemInputRef.value=""
    setShowPrompt(false)
    setHasValue(false)
  }

  const changeInput=(s:string)=>{
    systemInputRef.value=s
    setHasValue(true)
    setShowPrompt(false)
  }

  let interval:number
  let setRef:HTMLButtonElement
  onMount(() => {
    interval= setInterval(() => {
      if(systemInputRef){
        setRef.style.backgroundColor = setRef.style.backgroundColor == 'var(--c-bg)' ? 'var(--c-fg)' : 'var(--c-bg)';
        setRef.style.color = setRef.style.color == 'var(--c-fg)' ? 'var(--c-bg)' : 'var(--c-fg)';
      }

    }, 500);
    window.addEventListener("keydown", listener)
  })
  onCleanup(() => {
    window.removeEventListener("keydown", listener)
    clearInterval(interval)
  })
  return (
    <div class="my-4">
      <Show when={!props.systemRoleEditing()}>
        <Show when={props.currentSystemRoleSettings()}>
          <div>
            <div class="fi gap-1 op-50 dark:op-60">
              <IconEnv />
              <span>指定角色:</span>
            </div>
            <div class="mt-1">
              { props.currentSystemRoleSettings() }
            </div>
          </div>
        </Show>
        <Show when={!props.currentSystemRoleSettings() && props.canEdit()}>
          <span onClick={() => props.setSystemRoleEditing(!props.systemRoleEditing())} class="sys-edit-btn">
            <IconEnv />
            <span>指定系统角色</span>
          </span>
        </Show>
      </Show>
      <Show when={props.systemRoleEditing() && props.canEdit()}>
        <div>
          <div class="fi gap-1 op-50 dark:op-60">
            <IconEnv />
            <span>系统角色:</span>
          </div>
          <p class="my-2 leading-normal text-slate text-sm op-60">让GPT扮演你指定的角色</p>
          <div>
            <textarea
              ref={systemInputRef!}
              onInput={(e)=>{
                let { value } = e.currentTarget
                setShowPrompt(true)
                setPrompt(fzf.find(value).map(k => k.item))
                setHasValue(!!systemInputRef?.value)
              }}
              placeholder="可按空格键选择预设角色，也可以自己输入自定义角色。"
              autocomplete="off"
              autofocus
              rows="3"
              gen-textarea
            />
          </div>
          <Show when={showPrompt()}>
          <PromptList prompt={prompt} changeInput={changeInput} hover={false} />
          </Show>
          <button ref={setRef!} onClick={handleButtonClick}  mt-1 h-8 px-2 py-1 bg-slate bg-op-15 hover:bg-op-20 rounded-sm>
            {hasValue()?"设定角色":"取消设定"}
          </button>
          <Show when={!showPrompt()} >
            <button onClick={showPreset} mt-1 ml-2 h-8 px-2 py-1 bg-slate bg-op-15 hover:bg-op-20 rounded-sm>
              显示预设
            </button>
          </Show>
          <Show when={hasValue()} >
            <button onClick={clearRole} mt-1 ml-2 h-8 px-2 py-1 bg-slate bg-op-15 hover:bg-op-20 rounded-sm>
              清除角色
            </button>
          </Show>

        </div>
      </Show>
    </div>
  )
}

