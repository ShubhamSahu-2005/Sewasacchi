'use client'
import { CldUploadWidget } from 'next-cloudinary';
import React from 'react'

const Fundraiser = () => {
  return (
   <>
   <CldUploadWidget uploadPreset="sewasacchi">
  {({ open }) => {
    return (
      <button onClick={() => open()}>
        Upload an Image
      </button>
    );
  }}
</CldUploadWidget>
   
   </>
  )
}

export default Fundraiser