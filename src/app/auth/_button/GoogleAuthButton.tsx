import Image from "next/image"

const GoogleAuthButton = () => {
  return (
    <div className="relative">
      <Image src="/images/google_signin_buttons/btn_google_signin_dark_normal_web@2x.png" alt="Google auth button" width={200} height={60} className="hover:cursor-pointer hover:opacity-70"/>

    </div>
  )
}

export default GoogleAuthButton
