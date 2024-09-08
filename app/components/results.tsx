'use client'

import { HfInference } from "@huggingface/inference";
import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

type Developer = string
type ModelUrl = string

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_API_KEY;

const modelsList: Record<Developer, ModelUrl> = {
  'Stability AI - Stable Diffusion XL': 'stabilityai/stable-diffusion-xl-base-1.0',
  'Stability AI - Stable Diffusion Turbo': 'stabilityai/sdxl-turbo',
  'CompVis - Stable Diffusion': 'CompVis/stable-diffusion-v1-4',
  'Black Forest Labs - Flux': 'black-forest-labs/FLUX.1-dev',
  'XLabs AI - Flux': 'XLabs-AI/flux-RealismLora',
  'Prompt Hero - Open Journey': 'prompthero/openjourney-v4',
}

export const Results = () => {
  const [results, setResults] = useState<string>('');
  const [model, setModel] = useState<ModelUrl>(modelsList['Stability AI - Stable Diffusion XL'])
  const [promptTitle, setPromptTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const inference = new HfInference(HF_TOKEN);

  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return toast.warning('Digite algo para gerar a imagem.');

    try {
      toast.info('Gerando imagem...');
      setIsLoading(true);
      const response = await inference.textToImage({
        model: model,
        inputs: inputRef.current.value,
      }).catch((error) => {
        throw new Error(error)
      });
      toast.success('Imagem gerada com sucesso!');
      setPromptTitle(inputRef.current.value);
      setIsLoading(false);

      setResults(URL.createObjectURL(response));

      imageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    } catch (error: any) {
      setIsLoading(false);

      toast.error(`Modelo indisponível no momento. Tente escolher outro.\nMensagem de erro: ${error}`);
    }

  }

  return (
    <div className="mt-80 mx-auto flex flex-col gap-4 w-4/5">
      <div className="flex flex-row items-center justify-left w-3/5">
        <h2 className="text-lg font-bold">Modelo:</h2>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="p-1 flex-1 ml-4 rounded-lg bg-transparent border-2 border-gray-700 transition-all duration-100 focus-within:border-blue-800">
          {
            Object.entries(modelsList).map(([developer, modelUrl]) => (
              <option className='bg-stone-900' key={developer} value={modelUrl}>
                {developer}
              </option>
            ))
          }
        </select>
      </div>

      <form action='post' className="bg-stone-900 gap-2 rounded-xl border-2 border-gray-700 transition-all duration-100 focus-within:border-blue-800 mx-auto text-xl w-full relative flex items-center justify-center h-16">
        <label className="sr-only" htmlFor="search-input">Gerar imagem</label>
        <input ref={inputRef} className="bg-transparent pl-4 h-full w-full outline-none" type="text" id="search-input" />
        <button onClick={generateImage}
          disabled={isLoading}
          className={clsx(
            "bg-stone-950 mr-3 shadow-sm right-0 py-2 px-10 border-2 border-blue-900 rounded-md transition-all duration-100",
            isLoading && "opacity-50 cursor-wait",
            !isLoading && "hover:bg-blue-900"
          )}>
          Gerar
        </button>
      </form>

      <section className="flex flex-col gap-4 min-h-48 items-center justify-center pt-6 pb-16 overflow-x-hidden">
        {
          isLoading ?
            <div className="animate-spin absolute w-16 h-16 border-4 border-t-blue-800 border-r-blue-600 border-b-blue-400 border-l-blue-200 border-solid rounded-full" />
            :
            results &&
            <>
              <figcaption className="text-3xl text-center font-bold">🎨 {promptTitle}</figcaption>
              <figure className="relative w-96 h-96">
                <Image ref={imageRef} fill className="object-cover rounded-lg" src={results} alt="Generated Image" />
              </figure>
              {/* make it look like a button */}
              <a href={results} download={`${promptTitle}.png`}
                className="hover:bg-blue-950 py-3 px-10 rounded-md transition-all duration-100 bg-blue-900"
              >
                Baixar Imagem 📥
              </a>
            </>
        }
      </section>
    </div>
  );
}
