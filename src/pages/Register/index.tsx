import { useEffect, useContext } from "react";
import LogoImg from "../../assets/logo.svg";
import {Link, useNavigate} from "react-router-dom";
import { Container } from "../../components/container";

//Firebase
import { auth } from "../../services/FirebaseConection";
import {createUserWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";

import { Input } from "../../components/input";
import { Button } from "../../components/Button";
import {AuthContext} from "../../contexts/AuthContexts"

//npm install @hookform/resolvers
//npm install zod
//npm install react-hook-form
//npm install react-hot-toast
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";


const schema = z.object({
  email: z.string().email("Email não é válido").nonempty("O campo email é obrigatório"),
  password: z.string().min(6,"A senha deve ter 6 caracters").nonempty("O campo senha é obrigatório."),
  name: z.string().nonempty("o campo nome é obrigatório.")
})

type FormData = z.infer<typeof schema>

export const Register = () => {
  const {handleInfoUser} = useContext(AuthContext);
  const navigate = useNavigate()
  const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect( () => {
    async function handleLogout(){
      await signOut(auth)
    }

    handleLogout()
  }, [] )

  async function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async  (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })

      navigate("/dashboard", {replace: true})
      toast.success("Usuário cadastrado com sucesso!")

    } )
    .catch( (err) => {
      console.log("erro ao cadastrar ")
      console.log(err);
      toast.error("Não foi possível fazer o cadastro")
    } )
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-full">
          <img 
            src={LogoImg} 
            alt="Logo do site" 
            className="w-full"
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder='Digite seu nome completo'
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder='Digite seu email...'
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder='Digite sua senha...'
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <Button>
            Cadastrar
          </Button>

        </form>

        <Link to="/login">
          Já possui uma conta? Faça o login!
        </Link>
      </div>
    </Container>
  )
}

