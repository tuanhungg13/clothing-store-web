// components/CartItem.js
import { Checkbox, InputNumber } from 'antd';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const CartItem = ({ product, onChangeQuantity }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center gap-4">
        <Checkbox checked={product.selected} />
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <div>
          <h4 className="font-semibold">{product.name}</h4>
          <p className="text-gray-500 text-sm">${product.price}</p>
          <p className="text-gray-400 text-xs">Size: {product.size} | Color: {product.color}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="border rounded-full p-1 hover:bg-gray-100"
          onClick={() => onChangeQuantity(product.id, product.quantity - 1)}
        >
          <AiOutlineMinus />
        </button>
        <InputNumber
          min={1}
          value={product.quantity}
          onChange={(value) => onChangeQuantity(product.id, value)}
          className="w-16"
        />
        <button
          className="border rounded-full p-1 hover:bg-gray-100"
          onClick={() => onChangeQuantity(product.id, product.quantity + 1)}
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
