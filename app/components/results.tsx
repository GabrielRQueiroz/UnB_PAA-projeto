'use client'

import { useRef, useState } from "react";

export const Results = () => {
  const [results, setResults] = useState()
  const inputRef = useRef<HTMLInputElement>(null);
  // const openai = new OpenAI({
  //   apiKey,
  //   dangerouslyAllowBrowser: true
  // });
  // const genAI = new GoogleGenerativeAI(apiKey || '');
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!inputRef.current?.value) return;

    try {
      // const response = await model.generateContent(inputRef.current.value,);
      // setResults(response);
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
         <button onClick={generateImage} className="bg-stone-950 mr-4 shadow-sm right-0 py-3 px-10 border-2 border-blue-900 rounded transition-all duration-100 hover:bg-blue-900">
            Gerar
         </button>
      </form>

      <section>
        {/* {
          results && 
            results.response.candidates.map((image, index) => (
              <figure key={index} className="relative w-96 h-96">
                <img className="object-cover w-full h-full" src={image.url} alt={image.revised_prompt} />
              </figure>
            ))
        } */}
      </section>
    </>
  );
}
