import { Link, useNavigate } from 'react-router-dom'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

import jwt_decode from 'jwt-decode'

import shareVideo from '../../assets/share.mp4'
import logo from '../../assets/logowhite.png'
import { UserGoogle } from '../../types/user'
import { sanity } from '../../sanity'

const Login = () => {
  const navigate = useNavigate()
  const responseGoogle = (credentialResponse?: CredentialResponse) => {
    const credential = credentialResponse?.credential
    if (credential) {
      const user: UserGoogle = jwt_decode(credential)
      localStorage.setItem('user', user.sub)

      const { name, sub, picture } = user

      const document = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
      }

      sanity.createIfNotExists(document)

      return navigate('/', { replace: true })
    }
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          loop
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <Link to="/">
              <img
                src={logo}
                width="130px"
                alt="camera written shareme on the right"
              />
            </Link>
          </div>
          <div className="shadow-2xl">
            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
