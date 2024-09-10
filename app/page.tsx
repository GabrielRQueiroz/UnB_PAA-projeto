import Image from "next/image";
import { Bounce, ToastContainer } from "react-toastify";
import { Results } from "./components/results";

import 'react-toastify/dist/ReactToastify.min.css';

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl overflow-x-hidden">
      <nav className="fixed flex mx-auto items-center justify-between top-0 left-0 w-full px-8 py-4">
        <div id="logo" className="flex items-center gap-2">
          <figure className="h-12 w-12 relative">
            <Image className="object-contain" alt="Logo" src="/logo.png" fill />
          </figure>
          <p className="font-bold text-xl">
            Figurificadoríssimo
          </p>
        </div>
      </nav>

      <div className="pointer-events-none h-96 -z-10 max-h-fit absolute w-full top-0 left-0 overflow-y-hidden flex flex-col items-center justify-center">
        <h2 className="font-bold text-4xl">
          Gere imagens com IA
          <span className="my-2 block text-center text-blue-300 text-5xl">
            SEM CUSTO
          </span>
        </h2>
        <video tabIndex={-1} className="opacity-50 top-0 absolute mx-auto -z-20 w-screen" controls preload="true" autoPlay loop muted>
          <source src="/waves.mp4" type="video/mp4" />
        </video>
        <div className="z-10 absolute w-full h-1/2 bottom-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <Results />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        stacked
        transition={Bounce}
      />
    </main>
  );
}
