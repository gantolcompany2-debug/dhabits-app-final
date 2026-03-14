import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useApp, ShopItem, ShopFolder } from "@/contexts/AppContext";
import FormModal from "@/components/FormModal";
import { FormInput, FormSelect } from "@/components/FormInputs";
import CoinDisplay from "@/components/CoinDisplay";
import CharacterDisplay from "@/components/CharacterDisplay";
import { formatCoins } from "@/lib/coins";
import { nanoid } from "nanoid";

export default function ShopPage() {
  const {
    coins,
    shopItems,
    shopFolders,
    characterState,
    addShopItem,
    updateShopItem,
    deleteShopItem,
    purchaseItem,
    addShopFolder,
    deleteShopFolder,
    equipItem,
    unequipItem,
  } = useApp();

  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"character" | "background" | "vehicle" | "reward">("character");
  const [folderName, setFolderName] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    emoji: "🎁",
    price: 50,
    category: "character" as "reward" | "character" | "background" | "vehicle",
    slot: "body" as "head" | "body" | "hands" | "feet" | "accessory" | "background" | "vehicle",
    folder: "",
    assetPath: "",
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      const newFolder: ShopFolder = {
        id: nanoid(),
        name: folderName,
        collapsed: false,
      };
      addShopFolder(newFolder);
      setFolderName("");
      setShowCreateFolder(false);
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemForm.name.trim()) {
      const newItem: ShopItem = {
        id: nanoid(),
        name: itemForm.name,
        emoji: itemForm.emoji,
        price: itemForm.price,
        category: itemForm.category,
        folder: itemForm.folder || "default",
        purchased: false,
        slot: itemForm.slot,
        assetPath: itemForm.assetPath,
      };
      addShopItem(newItem);
      setItemForm({ 
        name: "", 
        emoji: "🎁", 
        price: 50, 
        category: "character", 
        slot: "body",
        folder: "",
        assetPath: "",
      });
      setShowCreateItem(false);
    }
  };

  const handleBuyItem = (itemId: string) => {
    purchaseItem(itemId);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteShopItem(itemId);
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteShopFolder(folderId);
  };

  const characterItems = shopItems.filter((i) => i.category === "character");
  const backgroundItems = shopItems.filter((i) => i.category === "background");
  const vehicleItems = shopItems.filter((i) => i.category === "vehicle");
  const rewardItems = shopItems.filter((i) => i.category === "reward");

  const isItemEquipped = (itemId: string): boolean => {
    return Object.values(characterState).includes(itemId);
  };

  const getEquippedSlot = (itemId: string): string | null => {
    for (const [slot, id] of Object.entries(characterState)) {
      if (id === itemId) return slot;
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Shop & Character</h2>
          <p className="text-muted-foreground mt-1">Customize your character and buy rewards</p>
        </div>
        <div className="flex gap-2">
          <CoinDisplay amount={coins} size="lg" showLabel={true} />
          <Button onClick={() => setShowCreateItem(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Character Preview Section */}
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Character Display */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Character</h3>
            <div className="bg-secondary/30 rounded-lg p-6 border border-border">
              <CharacterDisplay width={150} height={200} />
            </div>
            {/* Equipped Items Display */}
            <div className="mt-6 w-full max-w-xs">
              <h4 className="text-sm font-medium text-foreground mb-3">Equipped Items</h4>
              <div className="space-y-2">
                {Object.entries(characterState).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No items equipped yet</p>
                ) : (
                  Object.entries(characterState).map(([slot, itemId]) => {
                    const item = shopItems.find(i => i.id === itemId);
                    return item ? (
                      <div key={slot} className="flex items-center justify-between bg-secondary/50 rounded p-2 text-xs">
                        <span className="font-medium">{slot}: {item.emoji} {item.name}</span>
                        <button
                          onClick={() => unequipItem(slot as any)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { value: "character" as const, label: "👕 Clothes" },
                { value: "background" as const, label: "🏠 Houses" },
                { value: "vehicle" as const, label: "🚗 Vehicles" },
                { value: "reward" as const, label: "🎁 Rewards" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === tab.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="space-y-4">
              {selectedCategory === "character" && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Character Customization</h3>
                  {characterItems.length === 0 ? (
                    <div className="bg-secondary/30 rounded-lg border border-border p-6 text-center text-muted-foreground">
                      No character items yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {characterItems.map((item) => {
                        const equipped = isItemEquipped(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`bg-card rounded-lg border border-border p-3 flex flex-col ${
                              equipped ? "ring-2 ring-accent" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-3xl">{item.emoji}</div>
                              {equipped && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                                  Equipped
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">Slot: {item.slot}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-accent font-bold text-sm">{formatCoins(item.price)} 💰</span>
                              <div className="flex gap-1">
                                {!item.purchased ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleBuyItem(item.id)}
                                    disabled={coins < item.price}
                                    className="text-xs"
                                  >
                                    Buy
                                  </Button>
                                ) : equipped ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => unequipItem(getEquippedSlot(item.id) as any)}
                                    className="text-xs"
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => equipItem(item.id)}
                                    className="text-xs bg-accent hover:bg-accent/90"
                                  >
                                    Equip
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory === "background" && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Houses & Backgrounds</h3>
                  {backgroundItems.length === 0 ? (
                    <div className="bg-secondary/30 rounded-lg border border-border p-6 text-center text-muted-foreground">
                      No background items yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {backgroundItems.map((item) => {
                        const equipped = isItemEquipped(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`bg-card rounded-lg border border-border p-3 flex flex-col ${
                              equipped ? "ring-2 ring-accent" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-3xl">{item.emoji}</div>
                              {equipped && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{item.name}</h4>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-accent font-bold text-sm">{formatCoins(item.price)} 💰</span>
                              <div className="flex gap-1">
                                {!item.purchased ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleBuyItem(item.id)}
                                    disabled={coins < item.price}
                                    className="text-xs"
                                  >
                                    Buy
                                  </Button>
                                ) : equipped ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => unequipItem("background")}
                                    className="text-xs"
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => equipItem(item.id)}
                                    className="text-xs bg-accent hover:bg-accent/90"
                                  >
                                    Activate
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory === "vehicle" && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Vehicles</h3>
                  {vehicleItems.length === 0 ? (
                    <div className="bg-secondary/30 rounded-lg border border-border p-6 text-center text-muted-foreground">
                      No vehicle items yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vehicleItems.map((item) => {
                        const equipped = isItemEquipped(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`bg-card rounded-lg border border-border p-3 flex flex-col ${
                              equipped ? "ring-2 ring-accent" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-3xl">{item.emoji}</div>
                              {equipped && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{item.name}</h4>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-accent font-bold text-sm">{formatCoins(item.price)} 💰</span>
                              <div className="flex gap-1">
                                {!item.purchased ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleBuyItem(item.id)}
                                    disabled={coins < item.price}
                                    className="text-xs"
                                  >
                                    Buy
                                  </Button>
                                ) : equipped ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => unequipItem("vehicle")}
                                    className="text-xs"
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => equipItem(item.id)}
                                    className="text-xs bg-accent hover:bg-accent/90"
                                  >
                                    Activate
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory === "reward" && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Real Rewards</h3>
                  {rewardItems.length === 0 ? (
                    <div className="bg-secondary/30 rounded-lg border border-border p-6 text-center text-muted-foreground">
                      No reward items yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rewardItems.map((item) => (
                        <div
                          key={item.id}
                          className={`bg-card rounded-lg border border-border p-3 flex flex-col ${
                            item.purchased ? "opacity-60" : ""
                          }`}
                        >
                          <div className="text-3xl mb-2">{item.emoji}</div>
                          <h4 className="font-semibold text-foreground text-sm mb-1">{item.name}</h4>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-accent font-bold text-sm">{formatCoins(item.price)} 💰</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleBuyItem(item.id)}
                                disabled={item.purchased || coins < item.price}
                                className={`text-xs ${
                                  item.purchased
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                                }`}
                              >
                                {item.purchased ? "Owned" : "Buy"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Item Modal */}
      <FormModal
        title="Add Shop Item"
        isOpen={showCreateItem}
        onClose={() => setShowCreateItem(false)}
        onSubmit={handleCreateItem}
        submitText="Add Item"
      >
        <FormInput
          label="Item Name"
          value={itemForm.name}
          onChange={(name) => setItemForm({ ...itemForm, name })}
          placeholder="e.g., Red T-Shirt"
        />
        <FormInput
          label="Emoji"
          value={itemForm.emoji}
          onChange={(emoji) => setItemForm({ ...itemForm, emoji })}
          placeholder="👕"
        />
        <FormInput
          label="Price (coins)"
          type="number"
          value={itemForm.price.toString()}
          onChange={(price) => setItemForm({ ...itemForm, price: parseInt(price) || 0 })}
          placeholder="50"
        />
        <FormSelect
          label="Category"
          value={itemForm.category}
          onChange={(category) => setItemForm({ ...itemForm, category: category as any })}
          options={[
            { value: "character", label: "Character Item" },
            { value: "background", label: "Background" },
            { value: "vehicle", label: "Vehicle" },
            { value: "reward", label: "Real Reward" },
          ]}
        />
        {itemForm.category !== "reward" && (
          <FormSelect
            label="Slot"
            value={itemForm.slot}
            onChange={(slot) => setItemForm({ ...itemForm, slot: slot as any })}
            options={[
              { value: "head", label: "Head" },
              { value: "body", label: "Body" },
              { value: "hands", label: "Hands" },
              { value: "feet", label: "Feet" },
              { value: "accessory", label: "Accessory" },
              { value: "background", label: "Background" },
              { value: "vehicle", label: "Vehicle" },
            ]}
          />
        )}
        <FormInput
          label="Asset Path (SVG or Image URL)"
          value={itemForm.assetPath}
          onChange={(assetPath) => setItemForm({ ...itemForm, assetPath })}
          placeholder="Optional: SVG code or image URL"
        />
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">Folder</label>
          <select
            value={itemForm.folder}
            onChange={(e) => setItemForm({ ...itemForm, folder: e.target.value })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select Folder...</option>
            {shopFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </FormModal>

      {/* Create Folder Modal */}
      <FormModal
        title="Create Shop Folder"
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
        submitText="Create"
      >
        <FormInput
          label="Folder Name"
          value={folderName}
          onChange={setFolderName}
          placeholder="e.g., Casual Wear, Luxury"
        />
      </FormModal>
    </div>
  );
}
