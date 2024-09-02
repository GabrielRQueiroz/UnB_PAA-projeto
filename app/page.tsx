import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl overflow-x-hidden">
      <nav className="fixed flex mx-auto items-center justify-between top-0 left-0 w-full px-8 py-4">
        <div id="logo" className="flex items-center gap-2">
          <figure className="h-12 w-12 relative">
            <Image className="object-contain" alt="Logo" src="/logo.png" fill/>
          </figure>
          <p className="font-bold text-xl">
            Figurificadoríssimo
          </p>
        </div>
      </nav>

      <div className="pointer-events-none h-96 max-h-fit absolute w-screen top-0 left-0 overflow-y-hidden flex flex-col items-center justify-center">
        <h2 className="font-bold text-4xl">
          Gere imagens com IA
          <span className="my-2 block text-center text-blue-300 text-5xl">
            SEM CUSTO
          </span>
        </h2>
        <video className="opacity-50 top-0 absolute mx-auto -z-10 w-screen" controls preload="true" autoPlay loop muted>
          <source src="/waves.mp4" type="video/mp4" /> 
        </video>
        <div className="z-10 absolute w-full h-1/2 bottom-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <form action='post' className="bg-stone-900 gap-2 rounded-xl border-2 border-gray-700 transition-all duration-100 focus-within:border-blue-800 mx-auto text-xl mt-96 w-4/5 relative flex items-center justify-center h-20">
        <label className="sr-only" htmlFor="search-input">Gerar imagem</label>
        <input className="bg-transparent pl-4 h-full w-full outline-none" type="text" id="search-input" />
        <button className="bg-stone-950 mr-4 shadow-sm right-0 py-3 px-10 border-2 border-blue-900 rounded transition-all duration-100 hover:bg-blue-900">
          Gerar
        </button>
      </form>
    </main>
  );
}
