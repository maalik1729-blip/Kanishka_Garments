import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatINR, useCart } from "@/lib/cart";
import { toast } from "sonner";

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, setQty, remove, subtotal, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Your bag</SheetTitle>
          <SheetDescription>
            Retail checkout. For bulk pricing, request a wholesale quote.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <p className="mb-4">Your bag is empty.</p>
                <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                  <Link to="/products">Browse products</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.slug} className="flex gap-3 border-b border-border/60 pb-4">
                  <img
                    src={it.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{it.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatINR(it.price)} / {it.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => remove(it.slug)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(it.slug, it.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(it.slug, it.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div className="ml-auto text-sm font-semibold text-ink">
                        {formatINR(it.price * it.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-border/60 pt-4">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-bold text-ink">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Taxes & shipping calculated at checkout.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  toast.success("Order placed", {
                    description: "This is a demo checkout. We'll email you shortly.",
                  });
                  clear();
                  onOpenChange(false);
                }}
              >
                Checkout · {formatINR(subtotal)}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => clear()}>
                Clear bag
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
