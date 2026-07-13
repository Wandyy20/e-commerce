import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold tracking-widest mb-4">FASHIONSTORE</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Your one-stop destination for the latest fashion trends.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
            <li><Link href="/orders" className="hover:text-white transition">Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">Customer Service</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Track Order</li>
            <li>Returns & Exchanges</li>
            <li>Size Guide</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">Contact Us</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>support@fashionstore.com</li>
            <li>+62 812 3456 7890</li>
            <li className="flex gap-3 pt-2">
              <span className="cursor-pointer hover:text-white">IG</span>
              <span className="cursor-pointer hover:text-white">FB</span>
              <span className="cursor-pointer hover:text-white">TW</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-xs">
        © 2026 FashionStore. All rights reserved.
      </div>
    </footer>
  )
}