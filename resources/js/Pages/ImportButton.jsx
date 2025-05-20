import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"
import { router, usePage } from "@inertiajs/react"
import { Download } from "lucide-react"

const ImportButton = ({type}) => {
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const csrfToken = usePage().props.csrf_token

  const handleUpload = async (e) => {
    e.preventDefault();  // Pastikan ini dipanggil untuk mencegah halaman berpindah
    
    const file = fileInputRef.current?.files[0];
    if (!file) {
      toast("File tidak boleh kosong!");
      return;
    }
  
    const formData = new FormData();
    formData.append("excel", file);
  
    setLoading(true);
    try {
      await axios.post(`/import-${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRF-TOKEN": csrfToken,
        },
      });
  
      toast("Import sedang diproses di background");
      setOpen(false);
      router.visit(window.location.pathname, {
        preserveScroll: true
      });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Download /> Import</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import File Excel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="excel">Pilih file (.xlsx, .csv)</Label>
            <Input type="file" accept=".xlsx,.csv" ref={fileInputRef} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Mengupload..." : "Upload & Import"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ImportButton