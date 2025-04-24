import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { deleteShop, updateShop } from '../services/shopAPI'

const MyShop = () => {
  const [myShop, setMyShop] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [shopName, setShopName] = useState("")
  const [address, setAddress] = useState("")

  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    axios.get("/api/shop/all").then((res) => {
      const userId = JSON.parse(localStorage.getItem("user"))?.id
      const shop = res.data.shops.find((shop) => shop.owner._id === userId)
      setMyShop(shop)
      setShopName(shop?.shopName || "")
      setAddress(shop?.address || "")
    })
  }, [])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your shop?")) {
      dispatch(deleteShop({ shopId: myShop._id, token }))
    }
  }

  const handleUpdate = async () => {
    const updated = await dispatch(updateShop({ shopId: myShop._id, shopName, address, token }))
    if (updated) {
      setMyShop(updated)
      setEditMode(false)
    }
  }

  if (!myShop) return <p className="p-4">You don't have a shop registered.</p>

  return (
    <div className="p-4 border max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Shop</h2>

      {editMode ? (
        <>
          <input
            className="border p-2 mb-2 w-full"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {myShop.shopName}</p>
          <p><strong>Address:</strong> {myShop.address}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit 
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete 
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MyShop
