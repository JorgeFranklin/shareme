export default function getUserInfo(): string | undefined {
  const userInfo = localStorage.getItem('user')
  if (userInfo) {
    return userInfo
  } else {
    localStorage.clear()
  }
}
