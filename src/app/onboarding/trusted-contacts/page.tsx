'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, Phone, Radio } from 'lucide-react';
import { useStore } from '@/lib/store';
import PrimaryButton from '@/components/PrimaryButton';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

const RELATIONS = ['Mother', 'Father', 'Sister', 'Brother', 'Friend', 'Guardian'];

export default function TrustedContactsPage() {
  const router = useRouter();
  const { addTrustedContact, setOnboardingStep } = useStore();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: RELATIONS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddContact = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.match(/^\d{10,}$/)) newErrors.phone = 'Valid phone number required';
    if (!formData.relation) newErrors.relation = 'Please select a relation';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newContact: Contact = {
      id: Math.random().toString(),
      name: formData.name.trim(),
      phone: formData.phone,
      relation: formData.relation,
      isPrimary: contacts.length === 0, // First contact is primary by default
    };

    setContacts([...contacts, newContact]);
    setFormData({ name: '', phone: '', relation: RELATIONS[0] });
    setErrors({});
    setShowForm(false);
  };

  const handleRemoveContact = (id: string) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    // Ensure at least one primary contact if any remain
    if (newContacts.length > 0 && !newContacts.some((c) => c.isPrimary)) {
      newContacts[0].isPrimary = true;
    }
    setContacts(newContacts);
  };

  const handleSetPrimary = (id: string) => {
    setContacts(
      contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  const handleContinue = () => {
    // Save all contacts to store
    contacts.forEach((contact) => {
      addTrustedContact({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation,
        isPrimary: contact.isPrimary,
      });
    });

    setOnboardingStep('complete');
    router.push('/home');
  };

  const canAddMore = contacts.length < 5;

  return (
    <div className="screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8"
        style={{ background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 100%)' }}
      >
        <button onClick={() => router.back()} className="mb-5 text-white/70">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <p className="text-white/70 text-sm mb-1">Step 8 of 8</p>
        <h1 className="text-2xl font-extrabold text-white">Trusted contacts</h1>
        <p className="text-white/65 text-sm mt-1">Emergency contacts for your safety</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {contacts.length === 0 ? (
          <>
            {/* Empty state info */}
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Add trusted contacts</h3>
              <p className="text-sm text-slate-500 mb-6">
                These people will be notified in case of emergency
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Contact List */}
            <div className="space-y-3 mb-6">
              {contacts.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl border border-border p-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {contact.name}
                      </p>
                      {contact.isPrimary && (
                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {contact.relation} • {contact.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {!contact.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(contact.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Set as primary"
                      >
                        <Radio className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-2xl border border-border p-4 mb-6"
          >
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Add a contact</h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className="input-field text-sm"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') });
                    setErrors({ ...errors, phone: '' });
                  }}
                  className="input-field text-sm"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>

              {/* Relation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Relation
                </label>
                <select
                  value={formData.relation}
                  onChange={(e) => {
                    setFormData({ ...formData, relation: e.target.value });
                    setErrors({ ...errors, relation: '' });
                  }}
                  className="input-field text-sm"
                >
                  {RELATIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.relation && <p className="text-xs text-destructive mt-1">{errors.relation}</p>}
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border-2 border-border text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Add contact
              </button>
            </div>
          </motion.div>
        )}

        {/* Add button */}
        {!showForm && canAddMore && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm font-medium text-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add contact ({contacts.length}/5)
          </motion.button>
        )}

        {/* Limit reached */}
        {!showForm && contacts.length === 5 && (
          <p className="text-xs text-slate-500 text-center py-4">
            You&apos;ve added 5 contacts (maximum limit)
          </p>
        )}

        {/* Skip message */}
        <p className="text-xs text-slate-500 text-center mt-6">
          You can add more contacts later from your profile
        </p>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 pb-6">
        <PrimaryButton onClick={handleContinue}>
          Continue to HamSafar
        </PrimaryButton>
      </div>
    </div>
  );
}
