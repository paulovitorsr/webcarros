import {useEffect} from "react"
import LogoImg from "../../assets/logo.svg";
import {Link, useNavigate} from "react-router-dom";
import { Container } from "../../components/container";

//Firebase
import { auth } from "../../services/FirebaseConection";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";

//componentes
import { Input } from "../../components/input";
import { Button } from "../../components/Button";

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
  password: z.string().nonempty("O campo senha é obrigatório.")
})

type FormData = z.infer<typeof schema>

export const Login = () => {
  const navigate = useNavigate();
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

  function onSubmit(data: FormData){
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then(async  () => {
      navigate("/dashboard", {replace: true})
      toast.success("Usuário autenticado com sucesso!")
      
    } )
    .catch( (err) => {
      console.log("erro ao logar ")
      console.log(err);
      toast.error("Não foi possível fazer login")
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
            Acessar
          </Button>

        </form>

        <Link to="/register">
          Ainda não possui uma conta? cadastra-se!
        </Link>
      </div>
    </Container>
  )
}
