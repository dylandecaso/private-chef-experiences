// Renders an <img> that quietly falls back to the brand placeholder
// if the real photo hasn't been added yet. Drop real files into
// public/images/ (see public/images/README.md) and they appear automatically.
import { useState } from 'react'

const PLACEHOLDER = '/images/placeholder.svg'

export default function SafeImage({ src, alt = '', className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
