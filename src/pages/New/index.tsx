import { ChangeEvent, useContext, useState } from "react";
import {Container} from "../../components/container";
import {DashboardHeader} from "../../components/painelHeader";

import {FiUpload, FiTrash} from "react-icons/fi"
import {useForm} from "react-hook-form";
import {Input} from "../../components/input";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/Button";
import toast from "react-hot-toast";
import {AuthContext} from "../../contexts/AuthContexts"
import {v4 as uuidV4} from "uuid";
import {useNavigate} from "react-router-dom";

import {storage, db} from "../../services/FirebaseConection";
import {addDoc, collection} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const schema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano é obrigatório"),
  km: z.string().nonempty("O km do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatório"),
  whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{10,11})$/.test(value), {
    message: "Numero de telefone invalido."
  }),
  description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>

interface ImageProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export const New = () => {
  const {user} = useContext(AuthContext)
  const {register, handleSubmit, formState: {errors}, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const navigate = useNavigate()

  const [carImage, setCarImage] = useState<ImageProps[]>([])

 
  //Inicio do código enviando imagem para o banco
  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        await handleUpload(image)
      }else{
        toast.error("Envie uma imagem jpeg ou png")
        return;
      }


    }
  }

  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid
    const uidImage = uuidV4()

    const uploadRef = ref(storage, `image/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then( (snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        }

        setCarImage((images) => [...images, imageItem])

      })

    })

  }
  //Fim do código para enviar imagem

  function onSubmit(data: FormData){

    if(carImage.length === 0){
      toast.error("Por favor, envie uma imagem");
      return;
    }

    const carListImage = carImage.map(car => {
      return{
        uid: car.uid,
        name: car.name,
        url: car.url
      }
    })

    addDoc(collection(db, "cars"), {
      name: data.name.toLocaleUpperCase,
      model: data.model.toLocaleUpperCase,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImage
    })
    .then( () => {
      reset()
      setCarImage([])
      toast.success("Veículo cadastrado com sucesso!")
      navigate("/dashboard", {replace: true})
    } )
    .catch( (err) => {
      toast.error("Erro ao cadastrar veículo")
      console.log(err)
    } )
  }

  async function handleDeleteImage(item: ImageProps){
    const imagePath =  `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath)

    try {
      await deleteObject(imageRef)
      setCarImage(carImage.filter((car) => car.url !== item.url))
    } catch (err) {
      console.log("Erro ao deletar" + err)
    }
  }

  return (
    <Container>
      <DashboardHeader/>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
            <div className="absolute cursor-pointer">
             <FiUpload size={30} color="#000" />
            </div>
            <div className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                className="opacity-0 cursor-pointer" 
                onChange={handleFile}
              />
            </div>
        </button>

        {carImage.map( item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute" onClick={() => handleDeleteImage(item)}>
              <FiTrash size={30} color="#fff" />
            </button>
            <img 
              src={item.previewUrl} 
              className="rounded-lg w-full h-32 object-cover" 
              alt="foto"
            />
          </div>
        ) )}

      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form 
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <p className="mb-2 font-medium">Marca do carro</p>
            <Input 
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Fiat"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input 
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: Fiat Palio Attractiv"
            />
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano do carro</p>
              <Input 
                type="number"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ano de fabricação/modelo"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">KM do carro</p>
              <Input 
                type="number"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Km Total"
              />
            </div>
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input 
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Sua cidade"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Whatsapp:</p>
              <Input 
                type="number"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="71 999999999"
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço do carro</p>
            <Input 
              type="number"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Valor do veículo"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição do veículo</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2" 
              {...register("description")}
              name="description" 
              id="description"
              placeholder="Digite a descrição completa do veículo"
            />
            {errors.description && <p className="mb-1 text-red-500">{errors.description?.message}</p>}
          </div>

          <Button>
            Cadastrar
          </Button>
        </form>
      </div>
    </Container>
  )
}
