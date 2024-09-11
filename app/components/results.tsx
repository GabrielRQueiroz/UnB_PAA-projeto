'use client';
import { useState, useRef, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import clsx from "clsx";
import Image from "next/image";
import { toast } from "react-toastify";
import PromptEnhancer from "./promptEnhancer"; // Importa o PromptEnhancer

// Tipo para os modelos de IA disponíveis
type Developer = string;
type ModelUrl = string;

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_API_KEY; // Token da Hugging Face

const modelsList: Record<Developer, ModelUrl> = {
  'Stability AI - Stable Diffusion XL': 'stabilityai/stable-diffusion-xl-base-1.0',
  'Stability AI - Stable Diffusion XL (Handdrawn preset)': 'alvdansen/littletinies',
  'Stability AI - Stable Diffusion Turbo': 'stabilityai/sdxl-turbo',
  'CompVis - Stable Diffusion': 'CompVis/stable-diffusion-v1-4',
  'Black Forest Labs - Flux': 'black-forest-labs/FLUX.1-dev',
  'XLabs AI - Flux': 'XLabs-AI/flux-RealismLora',
  'Prompt Hero - Open Journey': 'prompthero/openjourney-v4',
  'Byte Dance - Hyper Stable Diffusion': 'ByteDance/Hyper-SD',
};

// Componente de resultados
export const Results = () => {
  const [results, setResults] = useState<string>('');
  const [model, setModel] = useState<ModelUrl>(modelsList['Stability AI - Stable Diffusion XL']);
  const [promptTitle, setPromptTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [approvedPrompt, setApprovedPrompt] = useState<string>(''); // Estado para o prompt aprovado
  const [controller, setController] = useState<AbortController>(new AbortController());
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // UseEffect para preencher o campo de texto com o prompt aprovado
  useEffect(() => {
    if (approvedPrompt && inputRef.current) {
      inputRef.current.value = approvedPrompt; // Atualiza o valor do campo de texto com o prompt aprovado
    }
  }, [approvedPrompt]);

  // Função para gerar a imagem com o prompt aprovado
  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Usar o prompt aprovado (do PromptEnhancer) ou o valor direto do inputRef
    const currentPrompt = inputRef.current?.value;

    if (!currentPrompt) {
      return toast.warning('Digite ou aprove um prompt para gerar a imagem.');
    }

    try {
      setIsLoading(true);
      const newController = new AbortController();
      setController(newController);

      const inference = new HfInference(HF_TOKEN, {
        signal: newController?.signal,
        use_cache: false,
        retry_on_error: false,
      });

      toast.info('Gerando imagem...');

      const response = await inference.textToImage({
        model: model,
        inputs: currentPrompt,
      });

      toast.success('Imagem gerada com sucesso!');
      setResults(URL.createObjectURL(response));
      setPromptTitle(currentPrompt);

      imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.warning('Requisição cancelada.');
      } else if (error.message.includes('is currently loading')) {
        toast.error('Modelo está recarregando no momento. Escolha outro ou tente novamente em breve.');
      } else {
        toast.error(`Erro inesperado: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 mx-auto flex flex-col gap-6 w-full max-w-4xl text-lg">
      <div className="flex flex-row items-center justify-between w-full">
        <h2 className="text-lg font-bold">Modelo:</h2>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-2 rounded-lg bg-transparent border-2 border-gray-700 transition-all duration-100 focus:border-blue-800"
        >
          {Object.entries(modelsList).map(([developer, modelUrl]) => (
            <option className="bg-stone-900" key={developer} value={modelUrl}>
              {developer}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt Enhancer */}
      <PromptEnhancer onApprovePrompt={setApprovedPrompt} />

      <form className="bg-stone-900 gap-2 rounded-xl border-2 border-gray-700 transition-all duration-100 focus-within:border-blue-800 mx-auto w-full relative flex items-center justify-center h-16">
        <label className="sr-only" htmlFor="search-input">Gerar imagem</label>
        <input
          ref={inputRef}
          className="bg-transparent pl-4 h-full w-full outline-none"
          type="text"
          id="search-input"
          placeholder="Digite o prompt ou use o aprimorado..."
        />
        <button
          onClick={generateImage}
          disabled={isLoading}
          className={clsx(
            'bg-stone-950 mr-3 shadow-sm right-0 py-2 px-10 border-2 border-blue-900 rounded-md transition-all duration-100 text-indigo-200',
            isLoading && 'opacity-50 cursor-wait',
            !isLoading && 'hover:bg-blue-900'
          )}
        >
          Gerar
        </button>
      </form>

      <section className="flex flex-col gap-6 min-h-48 items-center justify-center pt-6 pb-16 overflow-x-hidden">
        {isLoading ? (
          <div className="flex flex-col w-96 h-96 items-center justify-center gap-8">
            <div className="animate-spin w-16 h-16 border-4 border-t-blue-800 border-r-blue-600 border-b-blue-400 border-l-blue-200 border-solid rounded-full" />
            <button
              onClick={() => {
                controller.abort();
              }}
              className="bg-stone-950 py-2 px-10 border-2 border-blue-900 rounded-md transition-all duration-100 text-indigo-200 hover:bg-blue-900"
            >
              Cancelar ✖️
            </button>
          </div>
        ) : (
          results && (
            <>
              <figcaption className="text-3xl text-center font-bold">🎨 {promptTitle}</figcaption>
              <figure className="relative w-96 h-96">
                <Image
                  ref={imageRef}
                  fill
                  className="object-cover rounded-lg"
                  src={results}
                  alt="Generated Image"
                />
              </figure>
              <a
                href={results}
                download={`${promptTitle}.png`}
                className="hover:bg-blue-950 py-3 px-10 rounded-md transition-all duration-100 bg-blue-900 text-white"
              >
                Baixar Imagem 📥
              </a>
            </>
          )
        )}
      </section>
    </div>
  );
};
