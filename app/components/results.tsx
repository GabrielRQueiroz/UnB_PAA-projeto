'use client'

import { HfInference } from "@huggingface/inference";
import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_API_KEY;

export const Results = () => {
  const [results, setResults] = useState<Blob>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null);

  const inference = new HfInference(HF_TOKEN);

  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    try {
      setIsLoading(true);
      const response = await inference.textToImage({
        model: 'CompVis/stable-diffusion-v1-4',
        inputs: inputRef.current.value,
        parameters: {
          negative_prompt: 'blurry',
        }
      })
      setIsLoading(false);

      setResults(response);
      return
    } catch (error) {
      alert(error);
    }

  }

  return (
    <>
      <form action='post' className="bg-stone-900 gap-2 rounded-xl border-2 border-gray-700 transition-all duration-100 focus-within:border-blue-800 mx-auto text-xl mt-96 w-4/5 relative flex items-center justify-center h-20">
        <label className="sr-only" htmlFor="search-input">Gerar imagem</label>
        <input ref={inputRef} className="bg-transparent pl-4 h-full w-full outline-none" type="text" id="search-input" />
        <button onClick={generateImage}
          disabled={isLoading}
          className={clsx(
            "bg-stone-950 mr-4 shadow-sm right-0 py-3 px-10 border-2 border-blue-900 rounded transition-all duration-100",
            isLoading && "opacity-50 cursor-not-allowed",
            !isLoading && "hover:bg-blue-900"
          )}>
          Gerar
        </button>
      </form>

      <section className="flex items-center justify-center py-12">
        {
          isLoading ?
            <div className="animate-spin absolute w-16 h-16 border-4 border-t-white border-solid rounded-full" />
            :
            results &&
            <figure className="relative w-96 h-96">
              <Image fill className="object-cover rounded-lg" src={URL.createObjectURL(results)} alt="Generated Image" />
            </figure>  // URL.createObjectURL is used to create a blob URL from a Blob object
        }
      </section>
    </>
  );
}
