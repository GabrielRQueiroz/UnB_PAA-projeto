'use client';

import { useState, useRef } from "react";
import { toast } from "react-toastify";

// Tipagem para aprimoramentos
type EnhancementCategories = 'quality' | 'style' | 'colors' | 'texture' | 'composition' | 'environment' | 'effects' | 'photography';

const enhancementOptions: Record<EnhancementCategories, { label: string; description: string; options: { label: string; value: string }[] }> = {
  quality: {
    label: "Qualidade e Resolução",
    description: "Escolha a qualidade e a resolução da imagem.",
    options: [
      { label: 'Alta Qualidade', value: 'high quality, ultra-detailed' },
      { label: 'HD', value: 'high definition' },
      { label: '4K', value: '4k resolution' },
      { label: '8K', value: '8k resolution' },
    ],
  },
  style: {
    label: "Estilos Artísticos",
    description: "Escolha o estilo artístico desejado.",
    options: [
      { label: 'Realismo', value: 'realistic' },
      { label: 'Fotorrealismo', value: 'photorealistic' },
      { label: 'Estilo de Desenho', value: 'drawing style' },
      { label: 'Arte de Fantasia', value: 'fantasy art' },
      { label: 'Arte Abstrata', value: 'abstract art' },
      { label: 'Surrealismo', value: 'surrealism' },
      { label: 'Estilo de Aquarela', value: 'watercolor style' },
      { label: 'Pintura a Óleo', value: 'oil painting style' },
      { label: 'Arte Digital', value: 'digital art' },
      { label: 'Cartoon', value: 'cartoon style' },
    ],
  },
  colors: {
    label: "Cores e Luz",
    description: "Escolha o estilo de cores e iluminação.",
    options: [
      { label: 'Cores Vibrantes', value: 'vibrant colors' },
      { label: 'Tons Pastéis', value: 'pastel colors' },
      { label: 'Preto e Branco', value: 'black and white' },
      { label: 'Luz Natural', value: 'natural lighting' },
      { label: 'Iluminação Dramática', value: 'dramatic lighting' },
      { label: 'Contraste Alto', value: 'high contrast' },
    ],
  },
  texture: {
    label: "Detalhamento e Texturas",
    description: "Escolha o nível de detalhes e as texturas.",
    options: [
      { label: 'Super Detalhado', value: 'ultra-detailed' },
      { label: 'Texturas Realistas', value: 'realistic textures' },
      { label: 'Pele Suave', value: 'smooth skin' },
      { label: 'Superfície Reflexiva', value: 'reflective surface' },
    ],
  },
  composition: {
    label: "Composição e Tamanho",
    description: "Escolha a composição da imagem e o tamanho.",
    options: [
      { label: 'Grande Escala', value: 'large scale' },
      { label: 'Miniatura', value: 'miniature scale' },
      { label: 'Plano de Fundo Detalhado', value: 'detailed background' },
      { label: 'Campo de Visão Amplo', value: 'wide field of view' },
      { label: 'Perspectiva Dinâmica', value: 'dynamic perspective' },
    ],
  },
  environment: {
    label: "Cenário e Ambiente",
    description: "Escolha o tipo de cenário ou ambiente.",
    options: [
      { label: 'Cenário Natural', value: 'natural scenery' },
      { label: 'Cenário Urbano', value: 'urban scenery' },
      { label: 'Cenário Futurista', value: 'futuristic city' },
      { label: 'Cenário de Floresta', value: 'forest scenery' },
      { label: 'Paisagem Montanhosa', value: 'mountain landscape' },
      { label: 'Ambiente Distópico', value: 'dystopian environment' },
    ],
  },
  effects: {
    label: "Efeitos Especiais",
    description: "Escolha os efeitos especiais na imagem.",
    options: [
      { label: 'Efeitos de Luz', value: 'light effects, glowing' },
      { label: 'Fumaça e Névoa', value: 'smoke and fog' },
      { label: 'Partículas no Ar', value: 'particles in the air' },
      { label: 'Reflexos de Luz', value: 'lens flare' },
    ],
  },
  photography: {
    label: "Estilos de Fotografia",
    description: "Escolha o estilo de fotografia.",
    options: [
      { label: 'Estilo de Retrato', value: 'portrait style' },
      { label: 'Fotografia Macro', value: 'macro photography' },
      { label: 'Fotografia de Rua', value: 'street photography' },
      { label: 'Fotografia de Paisagem', value: 'landscape photography' },
      { label: 'Fotografia Noturna', value: 'night photography' },
    ],
  },
};

// Função para criar o componente de colapso (Accordion)
const GlobalAccordion = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-600 rounded-lg mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg focus:outline-none"
      >
        {label}
        <span className="float-right">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-3 bg-gray-800">{children}</div>}
    </div>
  );
};

// Componente para aprimorar o prompt manualmente
const PromptEnhancer = ({ onApprovePrompt }: { onApprovePrompt: (prompt: string) => void }) => {
  const [selectedEnhancements, setSelectedEnhancements] = useState<Record<EnhancementCategories, string>>({
    quality: '',
    style: '',
    colors: '',
    texture: '',
    composition: '',
    environment: '',
    effects: '',
    photography: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Função para lidar com a seleção de aprimoramentos
  const handleEnhancementChange = (category: EnhancementCategories, value: string) => {
    setSelectedEnhancements((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Função para gerar o prompt aprimorado
  const handleEnhancePrompt = () => {
    const userInput = inputRef.current?.value;

    if (!userInput) {
      toast.warning('Digite um prompt para gerar a imagem.');
      return;
    }

    // Concatena os aprimoramentos selecionados ao prompt original
    const enhancements = Object.values(selectedEnhancements).filter(Boolean).join(', ');
    const enhancedPrompt = `${userInput}. ${enhancements}`;

    onApprovePrompt(enhancedPrompt); // Passa o prompt aprimorado para o componente pai
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold">Aprimorar Prompt:</h2>

      {/* Input do prompt inicial */}
      <input
        ref={inputRef}
        className="bg-transparent p-2 rounded-lg border border-gray-600 w-full outline-none"
        type="text"
        placeholder="Digite o prompt inicial..."
      />

      {/* Accordion global que colapsa todas as opções de aprimoramento */}
      <GlobalAccordion label="Opções de Aprimoramento">
        {Object.entries(enhancementOptions).map(([category, { label, description, options }]) => (
          <div key={category} className="w-full mt-4">
            <label className="block text-sm font-bold mb-2">{label}</label>
            <p className="text-xs text-gray-500 mb-2">{description}</p>
            <select
              className="w-full p-2 border border-gray-600 rounded-lg bg-transparent outline-none"
              value={selectedEnhancements[category as EnhancementCategories]}
              onChange={(e) => handleEnhancementChange(category as EnhancementCategories, e.target.value)}
            >
              <option value="">Não quero esse aprimoramento</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </GlobalAccordion>

      {/* Botão para gerar o prompt aprimorado */}
      <button
        onClick={handleEnhancePrompt}
        className="mt-6 bg-blue-900 py-2 px-10 rounded-md transition-all duration-100 text-white"
      >
        Gerar Prompt
      </button>
    </div>
  );
};

export default PromptEnhancer;
