import { Container } from "../../components/container"

export const Home = () => {
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
          className="w-full border-2 rounded-lg h-9 px-3 outline-none text-lg" 
          placeholder="Digite o nome do carro..."
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo Brasil
      </h1>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="w-full bg-white rounded-lg">
          <img 
            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
            src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2023/202311/20231109/honda-hrv-1.8-16v-flex-exl-4p-automatico-wmimagem12365804241.jpg?s=fill&w=552&h=414&q=60" 
            alt="Honda" 
          />

          <p className="font-bold mt-1 mb-2">HONDA HR-V</p>
          <p>1.8 16V FLEX EXL 4P AUTOMÁTICO</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">Ano 2017/2017 | 48.471 KM</span>
            <strong className="text-black font-medium text-xl">R$ 96.000</strong>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">
                Salvador - BA
              </span>
            </div>
          </div>
        </section>

      </main>
    </Container>
  )
}
