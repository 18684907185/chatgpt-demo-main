import {onMount, Show} from 'solid-js'
import type {Accessor, Setter} from 'solid-js'
import IconEnv from './icons/Env'
import Key from "@/components/icons/Key";
import Eye from "@/components/icons/Eye";

interface Props {
    setKey: Setter<boolean>
    showKey: Accessor<boolean>
    currentKey: Accessor<string>
    setCurrentKey: Setter<string>
}

export default (props: Props) => {
    let keyRef: HTMLInputElement
    let alertRef:HTMLDivElement
    const onInput = () => {
        props.setCurrentKey(keyRef.value)
        alertRef.style.display = "none";
    }
    const onChange=()=>{
       const reg=/^sk-[a-zA-Z0-9]{48}$/

        if(!reg.test(keyRef.value)){
            alertRef.style.display = "flex";
            localStorage.removeItem("key")
            keyRef.value=""
        }else{
            localStorage.setItem("key", keyRef.value)
        }
    }
    return (
        <div class="my-4">

          <span onClick={() => props.setKey(!props.showKey())}
                class="inline-flex items-center justify-center gap-1 text-sm text-slate bg-slate/20 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate/50">
            <Key/>
            <span>设置Key</span>
          </span>

            <Show when={props.showKey()}>
                <div>
                    <p class="my-2 leading-normal text-slate text-sm op-60">填入OPENAI_API_KEY</p>
                    <div relative>
                        <input ref={keyRef!}
                               placeholder="不填使用公用KEY,可能不稳定"
                               onInput={onInput}
                               onChange={onChange}
                               value={props.currentKey()}
                               type="password"
                               w-full
                               px-3 py-3
                               min-h-12
                               max-h-36
                               text-slate
                               rounded-sm
                               bg-slate
                               bg-op-15
                               resize-none
                               focus:bg-op-20
                               focus:ring-0
                               focus:outline-none
                               placeholder:text-slate-400
                               placeholder:op-30/>
                        <span flex items-center right-0 top-1 inline-block onClick={
                            ()=>keyRef.type="text"
                        } align-middle	absolute w-10 h-10 op-60><Eye/></span>
                    </div>

                </div>
            </Show>
            <div ref={alertRef!} class="hidden items-center bg-orange-500 text-white text-sm font-bold px-4 py-3 op-70" role="alert">
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                <p>请填入格式正确的OPENAI_API_KEY</p>
            </div>
        </div>
    )
}
