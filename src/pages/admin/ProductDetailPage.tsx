import { useState } from "react";
import { 
  ChevronRight, 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield,
  Pencil,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const productImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200",
  "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=200",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200",
];

const reviews = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely fantastic headphones. The noise cancellation makes my commute completely silent. Battery life is also impressive.",
  },
  {
    id: 2,
    name: "Sarah Miller",
    initials: "SM",
    rating: 5,
    date: "1 week ago",
    comment: "Great sound quality, but the carrying case is a bit larger than the previous version. Still worth the upgrade!",
  },
];

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");

  const colors = [
    { id: "black", color: "bg-foreground" },
    { id: "silver", color: "bg-gray-300" },
    { id: "navy", color: "bg-blue-900" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader showSearch />

      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-1">
            <span>🏠</span> Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary">
            Electronics
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary">
            Audio
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Sony WH-1000XM5</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-muted/30 mb-4">
              <span className="absolute top-4 left-4 z-10 bg-foreground text-background text-xs font-medium px-3 py-1 rounded">
                NEW ARRIVAL
              </span>
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  {index === productImages.length - 1 ? (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                  ) : (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                PREMIUM AUDIO
              </span>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Edit Product
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3">
              Sony WH-1000XM5 Noise Canceling Headphones
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.8 (1,245 Reviews)</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-primary font-medium">In Stock</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">$348.00</span>
              <span className="text-xl text-muted-foreground line-through">$399.99</span>
              <span className="badge-sale">SAVE 13%</span>
            </div>

            <div className="space-y-4 text-muted-foreground mb-6">
              <p>
                Experience the next level of silence with the Sony WH-1000XM5. These headphones
                feature industry-leading noise cancellation, exceptional sound quality, and
                crystal-clear hands-free calling.
              </p>
              <p>
                Designed for all-day comfort with a lightweight chassis and soft leather fit,
                they offer up to 30 hours of battery life with quick charging capabilities.
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-3">
                Color: <span className="text-muted-foreground capitalize">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-10 h-10 rounded-full ${c.color} border-2 transition-all ${
                      selectedColor === c.id
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "ring-0"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button className="flex-1 gap-2 h-12">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Free shipping over $100
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                2 Year Warranty
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div className="card-admin p-6">
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">4.8</div>
                  <div className="flex items-center gap-0.5 mt-2 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Based on 1,245 reviews</p>
                </div>

                <div className="flex-1 space-y-2">
                  {[
                    { stars: 5, percent: 78 },
                    { stars: 4, percent: 15 },
                    { stars: 3, percent: 4 },
                    { stars: 2, percent: 1 },
                    { stars: 1, percent: 2 },
                  ].map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-3">{item.stars}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Write a Review
              </Button>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {review.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{review.name}</span>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-destructive text-destructive" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
