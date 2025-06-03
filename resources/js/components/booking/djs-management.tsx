import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ModalForm, FormField } from '@/components/ui/modal-form';
import { useToast } from '@/components/ui/toast';
import { router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface DJ {
  id: number;
  name: string;
  genres: string[];
  status: 'active' | 'inactive';
  home_city: string;
  homeCity?: string; // Frontend property for compatibility
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface DJsPageProps {
  djs: DJ[];
}

type PageProps = InertiaPageProps & {
  props: DJsPageProps;
}

// Format DJ data from backend to frontend format
const formatDjData = (dj: DJ): DJ => ({
  ...dj,
  // Ensure genres is always an array
  genres: Array.isArray(dj.genres) ? dj.genres : [],
  // Add homeCity for frontend compatibility
  homeCity: dj.home_city
});

export function DJsManagement() {
  const { showToast } = useToast();
  const { djs: backendDjs } = usePage<PageProps>().props;
  
  // Format DJs from backend to have proper structure for frontend
  const [currentDjs, setCurrentDjs] = useState<DJ[]>(
    (Array.isArray(backendDjs) ? backendDjs : []).map((dj: any) => formatDjData(dj))
  );
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDJFormFields = (dj?: DJ): FormField[] => [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: dj?.name || '',
      placeholder: 'DJ Name'
    },
    {
      id: 'genres',
      label: 'Genres/Tags (comma separated)',
      type: 'text',
      value: dj ? dj.genres.join(', ') : '',
      placeholder: 'House, Techno, Hip-Hop'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: dj?.status || 'active',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      id: 'homeCity',
      label: 'Home City',
      type: 'text',
      value: dj?.homeCity || '',
      placeholder: 'Berlin'
    }
  ];

  const handleAddDJ = (formData: Record<string, any>) => {
    setIsSubmitting(true);
    
    router.post(route('booking.djs.store'), {
      name: formData.name as string,
      genres: formData.genres as string,
      status: formData.status as 'active' | 'inactive',
      homeCity: formData.homeCity as string
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setIsSubmitting(false);
        showToast('DJ added successfully');
      },
      onError: () => {
        setIsSubmitting(false);
        showToast('Failed to add DJ', 'error');
      }
    });
  };

  const handleEditDJ = (formData: Record<string, any>) => {
    if (!selectedDJ) return;
    
    setIsSubmitting(true);
    
    router.put(route('booking.djs.update', { dj: selectedDJ.id }), {
      name: formData.name as string,
      genres: formData.genres as string,
      status: formData.status as 'active' | 'inactive',
      homeCity: formData.homeCity as string
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedDJ(null);
        setIsSubmitting(false);
        showToast('DJ updated successfully');
      },
      onError: () => {
        setIsSubmitting(false);
        showToast('Failed to update DJ', 'error');
      }
    });
  };

  const handleDeleteDJ = (id: number) => {
    if (confirm('Are you sure you want to delete this DJ?')) {
      router.delete(route('booking.djs.destroy', { dj: id }), {
        onSuccess: () => {
          showToast('DJ deleted successfully', 'info');
        },
        onError: () => {
          showToast('Failed to delete DJ', 'error');
        }
      });
    }
  };

  const handleEditClick = (dj: DJ) => {
    setSelectedDJ(dj);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">DJ Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add DJ
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Genres/Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Home City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDjs.map((dj) => (
              <TableRow key={dj.id}>
                <TableCell className="font-medium">{dj.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {dj.genres.map((genre, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={dj.status === 'active' ? 'default' : 'secondary'}
                    className={dj.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {dj.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{dj.homeCity || dj.home_city}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(dj)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteDJ(dj.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add DJ Modal */}
      <ModalForm
        title="Add New DJ"
        fields={getDJFormFields()}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddDJ}
      />

      {/* Edit DJ Modal */}
      {selectedDJ && (
        <ModalForm
          title={`Edit DJ: ${selectedDJ.name}`}
          fields={getDJFormFields(selectedDJ)}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditDJ}
        />
      )}
    </div>
  );
}
