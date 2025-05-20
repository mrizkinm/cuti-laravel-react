import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

const ExportButton = ({type, allFields}) => {
    const csrfToken = usePage().props.csrf_token
    const [selectedFields, setSelectedFields] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const toggleField = (field) => {
      setSelectedFields((prev) =>
        prev.includes(field)
          ? prev.filter((f) => f !== field)
          : [...prev, field]
      );
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await axios.post(`/export-${type}`, {
              fields: selectedFields,
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
            });
            const fileLink = `/storage/${response.data.file}`;
            toast("Export sedang diproses di background");
            setFileUrl(fileLink);
        } catch (error) {
           console.log(error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline"><Upload /> Export</Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Pilih Kolom yang Di-export</DialogTitle>
              <div className="space-y-2">
                {allFields.map((field) => (
                  <label key={field} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    {field}
                  </label>
                ))}
              </div>
              <Button
                onClick={handleExport}
                className="mt-4 w-full"
                disabled={isExporting || selectedFields.length === 0}
              >
                {isExporting ? "Meng-export..." : "Export Sekarang"}
              </Button>
      
              {fileUrl && (
                <a href={fileUrl} download>
                  <Button
                    className="mt-2 w-full"
                    disabled={isExporting || selectedFields.length === 0}
                  >
                   Download File
                  </Button>
                </a>
              )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
};

export default ExportButton;