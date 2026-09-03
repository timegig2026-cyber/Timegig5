import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Heart,
  Plus,
  X,
  Send,
  Star,
  Check,
  ShoppingBag,
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Contact } from '../types';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number | 'Free';
  imageUrl: string;
  imageUrls?: string[];
  category: 'Furniture' | 'Electronics' | 'Apparel' | 'Vehicles' | 'Home' | 'Free';
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  location: string;
  distance: string;
  postedTime: string;
  description: string;
  seller: {
    contactId?: string;
    name: string;
    avatarText: string;
    avatarColor: string;
    rating: number;
    ratingCount: number;
    joinedYear: string;
    responseTime: string;
    verified: boolean;
  };
}

export const formatRandPrice = (price: number | 'Free'): string => {
  if (price === 'Free') return 'Free';
  return `R ${price.toLocaleString()}`;
};

const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'fb-1',
    title: 'Mid-Century Velvet Lounge Armchair',
    price: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=600&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Furniture',
    condition: 'Used - Like New',
    location: 'Camps Bay, Cape Town',
    distance: '2.4 km',
    postedTime: '2 hours ago',
    description: 'Emerald green velvet accent armchair with solid walnut legs. Purchased last year, minimal wear, pet-free and smoke-free home. Pickup in Camps Bay.',
    seller: {
      contactId: 'contact-1',
      name: 'Sarah Jenkins',
      avatarText: 'SJ',
      avatarColor: 'bg-emerald-600 text-white',
      rating: 5.0,
      ratingCount: 38,
      joinedYear: '2019',
      responseTime: 'Responds within an hour',
      verified: true,
    },
  },
  {
    id: 'fb-2',
    title: 'Sony Alpha a7 III Mirrorless Camera (Body Only)',
    price: 14500,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'],
    category: 'Electronics',
    condition: 'Used - Good',
    location: 'Sandton, Johannesburg',
    distance: '3.1 km',
    postedTime: '4 hours ago',
    description: 'Shutter count ~18,000. Clean sensor, screen protector applied on day one. Comes with 2 original Sony batteries and dual charging dock.',
    seller: {
      contactId: 'contact-2',
      name: 'David Chen',
      avatarText: 'DC',
      avatarColor: 'bg-sky-600 text-white',
      rating: 4.9,
      ratingCount: 52,
      joinedYear: '2018',
      responseTime: 'Responds quickly',
      verified: true,
    },
  },
  {
    id: 'fb-3',
    title: 'Vintage Fuji 10-Speed Commuter Bicycle',
    price: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80'],
    category: 'Vehicles',
    condition: 'Used - Good',
    location: 'Stellenbosch, Western Cape',
    distance: '1.8 km',
    postedTime: '6 hours ago',
    description: 'Classic lightweight chromoly frame, freshly tuned brakes and gears, new handlebar grip tape and puncture-resistant tires. Ready to ride!',
    seller: {
      contactId: 'contact-4',
      name: 'Marcus Brody',
      avatarText: 'MB',
      avatarColor: 'bg-amber-600 text-white',
      rating: 4.8,
      ratingCount: 24,
      joinedYear: '2020',
      responseTime: 'Responds within a few hours',
      verified: true,
    },
  },
  {
    id: 'fb-4',
    title: 'Solid White Oak Coffee Table (Handmade)',
    price: 1950,
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80'],
    category: 'Furniture',
    condition: 'New',
    location: 'Rosebank, Johannesburg',
    distance: '4.2 km',
    postedTime: '1 day ago',
    description: 'Custom handcrafted modern minimalist coffee table made of solid kiln-dried white oak with matte water-resistant natural finish.',
    seller: {
      contactId: 'contact-3',
      name: 'Elena Rostova',
      avatarText: 'ER',
      avatarColor: 'bg-violet-600 text-white',
      rating: 5.0,
      ratingCount: 19,
      joinedYear: '2021',
      responseTime: 'Responds within 30 min',
      verified: true,
    },
  },
  {
    id: 'fb-5',
    title: 'Bose Noise Cancelling Over-Ear Headphones',
    price: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    category: 'Electronics',
    condition: 'Used - Like New',
    location: 'Umhlanga, Durban',
    distance: '3.8 km',
    postedTime: '1 day ago',
    description: 'Excellent condition, used primarily at home desk. Crisp audio with legendary active noise cancelling. Carrying case and cable included.',
    seller: {
      contactId: 'contact-1',
      name: 'Sarah Jenkins',
      avatarText: 'SJ',
      avatarColor: 'bg-emerald-600 text-white',
      rating: 5.0,
      ratingCount: 38,
      joinedYear: '2019',
      responseTime: 'Responds within an hour',
      verified: true,
    },
  },
  {
    id: 'fb-6',
    title: 'Monstera Deliciosa Plant + Glazed Ceramic Pot',
    price: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80'],
    category: 'Free',
    condition: 'Used - Good',
    location: 'Gardens, Cape Town',
    distance: '2.5 km',
    postedTime: '2 days ago',
    description: 'Moving out and need to rehome this healthy 3ft tall split-leaf monstera. Healthy roots and several new fenestrations. Free to a good home for curbside pickup today!',
    seller: {
      contactId: 'contact-2',
      name: 'David Chen',
      avatarText: 'DC',
      avatarColor: 'bg-sky-600 text-white',
      rating: 4.9,
      ratingCount: 52,
      joinedYear: '2018',
      responseTime: 'Responds quickly',
      verified: true,
    },
  },
  {
    id: 'fb-7',
    title: 'Retro Bluetooth Turntable Vinyl Record Player',
    price: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'],
    category: 'Electronics',
    condition: 'Used - Like New',
    location: 'Green Point, Cape Town',
    distance: '2.9 km',
    postedTime: '2 days ago',
    description: '3-speed belt-drive turntable with built-in stereo speakers and Bluetooth receiver. Warm wooden casing with dust cover.',
    seller: {
      contactId: 'contact-4',
      name: 'Marcus Brody',
      avatarText: 'MB',
      avatarColor: 'bg-amber-600 text-white',
      rating: 4.8,
      ratingCount: 24,
      joinedYear: '2020',
      responseTime: 'Responds within a few hours',
      verified: true,
    },
  },
  {
    id: 'fb-8',
    title: 'Custom Wooden Mechanical Keyboard (Gateron Yellows)',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'],
    category: 'Electronics',
    condition: 'Used - Like New',
    location: 'Waterkloof, Pretoria',
    distance: '1.5 km',
    postedTime: '3 days ago',
    description: 'Solid walnut wooden case, hot-swappable PCB, lubed Gateron Yellow linear switches, and PBT dye-sub keycaps. Sounds buttery smooth.',
    seller: {
      contactId: 'contact-3',
      name: 'Elena Rostova',
      avatarText: 'ER',
      avatarColor: 'bg-violet-600 text-white',
      rating: 5.0,
      ratingCount: 19,
      joinedYear: '2021',
      responseTime: 'Responds within 30 min',
      verified: true,
    },
  },
];

interface MarketViewProps {
  contacts?: Contact[];
  onSelectContact?: (contact: Contact) => void;
  onSendMessage?: (contactId: string, content: { text?: string; imageUrl?: string; videoUrl?: string }) => void;
  onAddNotification?: (notif: { type: 'market'; title: string; description: string }) => void;
  onBack?: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  contacts = [],
  onSelectContact,
  onSendMessage,
  onAddNotification,
  onBack,
}) => {
  const [items, setItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set(['fb-1']));
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  // Quick message input for item detail
  const [messageText, setMessageText] = useState('Hi, is this still available?');
  const [messageSent, setMessageSent] = useState(false);

  // Sell Modal state
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<MarketplaceItem['category']>('Furniture');
  const [newCondition, setNewCondition] = useState<MarketplaceItem['condition']>('Used - Like New');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Cape Town, Western Cape');
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);

  const categories = [
    'All',
    'Furniture',
    'Electronics',
    'Vehicles',
    'Free',
  ];

  const locations = [
    'All',
    'Cape Town',
    'Western Cape',
    'Johannesburg',
    'Pretoria',
    'Gauteng',
    'Durban',
    'KwaZulu-Natal',
  ];

  const quickQuestions = [
    'Hi, is this still available?',
    'What is the condition?',
    'Are you open to offers?',
    'Can I pick this up today?',
  ];

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const urls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file as File);
      urls.push(url);
    });
    setNewImageUrls((prev) => [...prev, ...urls]);
  };

  const handleOpenItem = (item: MarketplaceItem) => {
    setActiveItem(item);
    setActiveImageIdx(0);
    setMessageText('Hi, is this still available?');
    setMessageSent(false);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageSent(true);

    if (activeItem?.seller.contactId) {
      const contactId = activeItem.seller.contactId;
      if (onSendMessage) {
        onSendMessage(contactId, { text: messageText });
      }
      if (onSelectContact) {
        const matched = contacts.find((c) => c.id === contactId);
        if (matched) {
          setTimeout(() => {
            onSelectContact(matched);
          }, 800);
        }
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setActiveItem(null);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedPrice = newPrice.trim().toLowerCase() === 'free' || newPrice === '0'
      ? 'Free'
      : parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 0;

    const defaultImg = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80';
    const primaryImg = newImageUrls.length > 0 ? newImageUrls[0] : defaultImg;
    const allImages = newImageUrls.length > 0 ? newImageUrls : [defaultImg];

    const newItem: MarketplaceItem = {
      id: `fb-${Date.now()}`,
      title: newTitle,
      price: parsedPrice,
      imageUrl: primaryImg,
      imageUrls: allImages,
      category: newCategory,
      condition: newCondition,
      location: newLocation,
      distance: 'Just now',
      postedTime: 'Just now',
      description: newDescription || 'Listed on Marketplace.',
      seller: {
        name: 'You',
        avatarText: 'ME',
        avatarColor: 'bg-neutral-900 text-white',
        rating: 5.0,
        ratingCount: 1,
        joinedYear: '2024',
        responseTime: 'Responds instantly',
        verified: true,
      },
    };

    setItems([newItem, ...items]);
    if (onAddNotification) {
      onAddNotification({
        type: 'market',
        title: 'New marketplace listing',
        description: `You listed "${newItem.title}" for ${formatRandPrice(newItem.price)}`,
      });
    }
    setIsSellModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImageUrls([]);
  };



  const checkLocationMatch = (itemLocation: string, selectedLocation: string) => {
    if (selectedLocation === 'All') return true;
    
    const locLower = itemLocation.toLowerCase();
    const selLower = selectedLocation.toLowerCase();
    
    if (locLower.includes(selLower)) return true;
    
    if (selLower === 'western cape') {
      return locLower.includes('cape town') || locLower.includes('stellenbosch') || locLower.includes('camps bay') || locLower.includes('green point') || locLower.includes('sea point');
    }
    if (selLower === 'gauteng') {
      return locLower.includes('johannesburg') || locLower.includes('pretoria') || locLower.includes('sandton') || locLower.includes('rosebank');
    }
    if (selLower === 'kwazulu-natal') {
      return locLower.includes('durban') || locLower.includes('umhlanga');
    }
    
    return false;
  };

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.seller.name.toLowerCase().includes(q) ||
      checkLocationMatch(item.location, q);
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = checkLocationMatch(item.location, searchLocation);
    return matchesSearch && matchesCat && matchesLocation;
  });

  return (
    <div id="marketplace-container" className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header Bar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shrink-0 shadow-xs">
        <div className="px-4 pt-3 pb-2.5">
          {/* Very Top Bar: Back, Search Bar with Filter inside, & Sell Action */}
          <div className="flex items-center gap-2 mb-2">
            {onBack && (
              <button
                type="button"
                id="marketplace-back-btn"
                onClick={onBack}
                aria-label="Back to previous screen"
                className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* Search Bar with Search Filter inside */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="marketplace-search-input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Marketplace..."
                  className="w-full pl-10 pr-28 py-2 bg-neutral-100 focus:bg-white text-sm text-neutral-950 placeholder:text-neutral-500 rounded-full border border-transparent focus:border-neutral-300 focus:outline-none transition-colors shadow-2xs"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-neutral-400 hover:text-neutral-700 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Category filter dropdown inside search bar */}
                  <div className="relative">
                    <button
                      type="button"
                      id="marketplace-filter-dropdown-btn"
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-xs border border-neutral-200 transition-colors"
                    >
                      <span>{selectedCategory}</span>
                      <ChevronDown className="w-3 h-3 text-neutral-500" />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 transition-colors ${
                              selectedCategory === cat ? 'bg-neutral-50 font-bold text-neutral-950' : 'text-neutral-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* Sell Button */}
            <button
              type="button"
              id="marketplace-sell-btn"
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Sell</span>
            </button>
          </div>

          {/* Location & Radius Bar */}
          <div className="flex items-center justify-between pt-0.5 text-xs text-neutral-600">
            <div className="relative">
              <button
                type="button"
                id="marketplace-location-pill"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 text-neutral-800 font-semibold hover:text-neutral-950 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                <span>{searchLocation === 'All' ? 'Everywhere' : searchLocation}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSearchLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 transition-colors ${
                        searchLocation === loc ? 'bg-neutral-50 font-bold text-neutral-950' : 'text-neutral-700'
                      }`}
                    >
                      {loc === 'All' ? 'Everywhere' : loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">
              {filteredItems.length} listings
            </span>
          </div>
        </div>
      </header>

      {/* Main Listing View: Large Square Logos with Details Underneath */}
      <div id="marketplace-grid-scroll" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {filteredItems.length === 0 ? (
          <div id="marketplace-empty-state" className="py-16 text-center text-neutral-500">
            <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="font-semibold text-neutral-800 text-sm">No listings found</p>
            <p className="text-xs text-neutral-400 mt-1">Try changing your search keywords or category.</p>
          </div>
        ) : (
          /* =========================================================
             COMPACT SQUARE PROFILE LOGOS WITH DETAILS UNDERNEATH
             No badges on the square, compact square profile logo,
             with item title, price in Rand (R), location, and seller details below.
          ========================================================== */
          <div
            id="marketplace-logos-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center items-start py-4"
          >
            {filteredItems.map((item) => (
              <button
                key={item.id}
                id={`marketplace-logo-${item.id}`}
                type="button"
                onClick={() => handleOpenItem(item)}
                aria-label={`${item.title} - ${formatRandPrice(item.price)} by ${item.seller.name}`}
                className="group flex flex-col items-center text-center w-full max-w-[170px] sm:max-w-[190px] focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400 rounded-2xl p-2.5 sm:p-3 transition-all duration-200 hover:bg-neutral-50"
              >
                {/* Square Item Photo */}
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 sm:ring-4 ring-neutral-100 group-hover:ring-neutral-900 shadow-sm group-hover:shadow-lg flex items-center justify-center transition-all duration-200 select-none group-hover:scale-105 bg-neutral-100"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className={`w-full h-full ${item.seller.avatarColor} flex items-center justify-center text-2xl font-black`}>
                      {item.seller.avatarText}
                    </div>
                  )}
                </div>

                {/* Details Under the Square */}
                <div className="mt-2.5 w-full flex flex-col items-center">
                  {/* Price in Rand */}
                  <span className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                    {formatRandPrice(item.price)}
                  </span>

                  {/* Title */}
                  <h3 className="mt-0.5 text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-neutral-950 transition-colors leading-snug px-1">
                    {item.title}
                  </h3>

                  {/* Seller & Location info */}
                  <div className="mt-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs text-neutral-500 truncate max-w-full">
                    <span className="truncate font-medium">{item.seller.name}</span>
                    <span>·</span>
                    <span className="text-neutral-400 truncate">{item.distance}</span>
                  </div>

                  {/* Condition chip */}
                  <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                    {item.condition}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>



      {/* =========================================================
          ITEM DETAIL MODAL (Opens when tapping any Logo)
      ========================================================== */}
      {activeItem && (
        <div
          id="item-detail-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            id="item-detail-card"
            className="w-full max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Listing Details
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleSave(activeItem.id)}
                  className="p-2 text-neutral-600 hover:text-rose-500 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      savedItemIds.has(activeItem.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-neutral-700'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
              {/* Product Photo */}
              <div className="relative aspect-[4/3] w-full bg-neutral-900 group/photo">
                <img
                  src={(activeItem.imageUrls && activeItem.imageUrls.length > 0) ? activeItem.imageUrls[activeImageIdx] : activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsFullScreenOpen(true)}
                />
                
                {/* Expand to Full Screen Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsFullScreenOpen(true)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-all shadow-md opacity-0 group-hover/photo:opacity-100"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Left/Right Carousel Arrows inside Card */}
                {activeItem.imageUrls && activeItem.imageUrls.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : (activeItem.imageUrls?.length || 1) - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev < (activeItem.imageUrls?.length || 1) - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {activeItem.imageUrls && activeItem.imageUrls.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-4 overflow-x-auto">
                    {activeItem.imageUrls.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIdx === idx ? 'border-white scale-105 shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price Header */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-neutral-950 leading-snug">
                  {activeItem.title}
                </h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-neutral-950">
                    {formatRandPrice(activeItem.price)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Listed {activeItem.postedTime} in {activeItem.location}
                  </span>
                </div>
              </div>

              {/* "Send Seller a Message" Box or "Manage Your Listing" */}
              {activeItem.seller.name === 'You' ? (
                <div className="p-5 bg-neutral-50/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      Your Listing
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Manage or remove your item from the marketplace.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(activeItem.id)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Listing</span>
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-neutral-50/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900">
                      Send seller a message
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {activeItem.seller.responseTime}
                    </span>
                  </div>

                  {messageSent ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Message sent to {activeItem.seller.name}! Opening chat...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Write a message..."
                          className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          id="send-marketplace-msg-btn"
                          onClick={handleSendMessage}
                          className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>

                      {/* Quick suggestion chips */}
                      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-1">
                        {quickQuestions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setMessageText(q)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 whitespace-nowrap transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Item Details Grid */}
              <div className="p-5">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-400 block text-[11px]">Condition</span>
                    <span className="font-bold text-neutral-900">{activeItem.condition}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-400 block text-[11px]">Category</span>
                    <span className="font-bold text-neutral-900">{activeItem.category}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Seller Information Card */}
              <div className="p-5">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  Seller Information
                </h3>
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="relative">
                    <div
                      className={`w-13 h-13 rounded-full ${activeItem.seller.avatarColor} text-base font-bold flex items-center justify-center border-2 border-white shadow-xs`}
                    >
                      {activeItem.seller.avatarText}
                    </div>
                    {activeItem.seller.verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sky-500 text-white rounded-full flex items-center justify-center ring-2 ring-white">
                        <BadgeCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-neutral-950 truncate">
                        {activeItem.seller.name}
                      </h4>
                      {activeItem.seller.verified && (
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded-md">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-neutral-800">{activeItem.seller.rating}</span>
                      <span>({activeItem.seller.ratingCount} seller ratings)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Joined in {activeItem.seller.joinedYear} • Highly rated on Marketplace
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Preview */}
              <div className="p-5">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Public Meetup Location
                </h3>
                <div className="p-3 bg-neutral-50 rounded-xl flex items-center gap-2.5 text-xs text-neutral-700">
                  <MapPin className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                  <span>{activeItem.location} ({activeItem.distance} away)</span>
                </div>
                <div className="mt-2 h-24 rounded-xl bg-neutral-200/80 relative overflow-hidden flex items-center justify-center text-xs font-medium text-neutral-500">
                  <div className="w-16 h-16 rounded-full bg-sky-400/20 border-2 border-sky-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className="absolute bottom-2 text-[10px] text-neutral-500 font-semibold bg-white/80 px-2 py-0.5 rounded-full">
                    Approximate location
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FULL SCREEN IMAGE VIEWER MODAL
      ========================================================== */}
      {isFullScreenOpen && activeItem && (
        <div
          id="fullscreen-image-backdrop"
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-2 sm:p-6"
          onClick={() => setIsFullScreenOpen(false)}
        >
          {/* Top Bar inside Full Screen */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 text-white">
            <span className="text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              {activeImageIdx + 1} of {(activeItem.imageUrls && activeItem.imageUrls.length > 0) ? activeItem.imageUrls.length : 1}
            </span>
            <button
              type="button"
              onClick={() => setIsFullScreenOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Fullscreen Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center max-w-5xl max-h-[80vh] px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={(activeItem.imageUrls && activeItem.imageUrls.length > 0) ? activeItem.imageUrls[activeImageIdx] : activeItem.imageUrl}
              alt={activeItem.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Left Arrow */}
            {activeItem.imageUrls && activeItem.imageUrls.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : (activeItem.imageUrls?.length || 1) - 1))}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Arrow */}
            {activeItem.imageUrls && activeItem.imageUrls.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev < (activeItem.imageUrls?.length || 1) - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {activeItem.imageUrls && activeItem.imageUrls.length > 1 && (
            <div
              className="absolute bottom-4 inset-x-4 flex justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx ? 'border-white scale-110 shadow-lg' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          "SELL AN ITEM" MODAL (Post to Marketplace)
      ========================================================== */}
      {isSellModalOpen && (
        <div
          id="sell-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setIsSellModalOpen(false)}
        >
          <div
            id="sell-modal-card"
            className="w-full max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-neutral-950">
                Create New Listing
              </h2>
              <button
                type="button"
                onClick={() => setIsSellModalOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Accent Chair"
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Price (Rand - R) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 1500 or Free"
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Home">Home</option>
                    <option value="Free">Free</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Cape Town, Western Cape"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Photos (Select multiple from device)
                </label>
                <div className="flex flex-wrap gap-2.5 mb-2">
                  {newImageUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 group shadow-xs">
                      <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <button
                        type="button"
                        onClick={() => setNewImageUrls(newImageUrls.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-neutral-100 flex flex-col items-center justify-center cursor-pointer text-neutral-500 hover:text-neutral-900 transition-colors">
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold text-center px-1">Add Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelection}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your item, dimensions, pickup details..."
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="publish-listing-btn"
                  className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm transition-colors shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
