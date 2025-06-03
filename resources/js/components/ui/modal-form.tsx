import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'color';
  value: string | number;
  options?: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

interface ModalFormProps {
  title: string;
  fields: FormField[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: Record<string, any>) => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export function ModalForm({
  title,
  fields,
  open,
  onOpenChange,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel'
}: ModalFormProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(
    fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as Record<string, any>)
  );

  React.useEffect(() => {
    // Update form data when fields change
    setFormData(
      fields.reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {} as Record<string, any>)
    );
  }, [fields]);

  const handleChange = (id: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={formData[field.id] as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            value={formData[field.id] as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={formData[field.id] as number}
            onChange={(e) => handleChange(field.id, parseInt(e.target.value, 10))}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              id={field.id}
              value={formData[field.id] as string}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="h-8 w-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData[field.id] as string}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={formData[field.id] as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] pr-2 my-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.id} className={`space-y-2 ${field.type === 'textarea' ? 'col-span-2' : ''}`}>
                  <label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
