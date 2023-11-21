import {useEffect, useState, useContext} from "react";
import {Container} from "../../components/container";
import {DashboardHeader} from "../../components/painelHeader";
import {FiTrash2} from "react-icons/fi";
import {db, storage} from "../../services/FirebaseConection";
import {ref, deleteObject} from "firebase/storage";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  deleteDoc
} from "firebase/firestore";

import {AuthContext} from "../../contexts/AuthContexts";
import toast from "react-hot-toast";

interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string | number;
  model: string;
  images: ImagesProps[];
}

interface ImagesProps{
  name: string;
  uid: string;
  url: string;
}

export const Dashboard = () => {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const {user} = useContext(AuthContext);

  useEffect( () => {
    function loadCars(){
      if(!user?.uid){
        return;
      }

      const carsRef = collection(db, "cars")
      const queryRef = query(carsRef, where("uid", "==", user.uid))

      getDocs(queryRef)
      .then( (snapshot) => {
        const listCars = [] as CarsProps[];

        snapshot.forEach( doc => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            city: doc.data().city,
            uid: doc.data().uid,
            price: doc.data().price,
            km: doc.data().km,
            images: doc.data().images,
            model: doc.data().model
            
          })
        })

        setCars(listCars);


      } )

    }

    loadCars()
  }, [user] )

  async function handleDeleteCar(car: CarsProps){
    const itemCar = car;

    const docRef =  doc(db, "cars", itemCar.id,)
    await deleteDoc(docRef);

    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`
      const imageRef = ref(storage, imagePath)

      try {
        await deleteObject(imageRef);
        setCars(cars.filter(car => car.id !== itemCar.id))
        
        toast.success("Imagem excluida!")
      } catch (error) {
        toast.error("Erro ao excluir essa imagem!")
        console.log(error)
      }

    })
    
  }


    return (
      <Container>
        <DashboardHeader/>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {cars.map( car => (
            <section key={car.id} className="w-full bg-white rounded-lg mb-2 max-h-70 relative">
              <button 
                className="absolute bg-white w-11 h-11 rounded-full flex items-center justify-center right-2 top-8 drop-shadow"
                onClick={ () => handleDeleteCar(car) }
              >
                <FiTrash2 size={24} color="#000" />
              </button>
              <img 
                src={car.images[0].url} 
                alt="carro" 
              />
              <p className="font-bold mt-1 px-2 mb-2">{car.model}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700">
                  Ano {car.year} | {car.km} km
                </span>
                <strong className="text-black font-bold mt-4">
                  R$ {car.price}
                </strong>
                <div className="w-full h-px bg-slate-200 my-2"></div>
                <div className="px-2 pb-2">
                  <span className="text-black">
                    {car.city}
                  </span>
                </div>
              </div>
            </section>
          ) )}
          
        </main>
      </Container>
    )
  }