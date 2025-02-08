// React
import { useFormStatus } from "react-dom";

export default function FormBtn({type, className, children, handleClick = null }) {
  const { pending } = useFormStatus();
  return !handleClick ? (
    <button
      type={type}
      className={className}
      disabled={pending}
    >
      {children}
    </button>
  ) : (
    <button
      type={type}
      className={className}
      disabled={pending}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
