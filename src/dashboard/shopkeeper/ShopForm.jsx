import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createShop } from '../../services/operations/shopAPI'

const ShopForm = () => {
  const [shopName, setShopName] = useState("")
  const [address, setAddress] = useState("")
  const dispatch = useDispatch()

  const token = useSelector((state) => state.auth.token)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(createShop({ shopName, address, token }))
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4 font-semibold">Register Your Shop</h2>
      <input
        type="text"
        placeholder="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Shop
      </button>
    </form>
  )
}

export default ShopForm
