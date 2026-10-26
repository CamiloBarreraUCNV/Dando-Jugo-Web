import React, { useState } from 'react';
import { ANIMAL_AVATARS, getAnimalAvatar } from '../utils/animalAvatars';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

const GENDERS = [
  { id: 'hombre', label: 'Hombre', icon: '👨' },
  { id: 'mujer', label: 'Mujer', icon: '👩' },
  { id: 'otro', label: 'Otro', icon: '🧑' },
];

export default function PlayerSetup({ players, onSavePlayers, onCancel, isFirstTime }) {
  const [list, setList] = useState(players || []);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('hombre');
  const [selectedAnimal, setSelectedAnimal] = useState(() => {
    const used = (players || []).map((p) => p.animal);
    const available = ANIMAL_AVATARS.find((a) => !used.includes(a.id));
    return available ? available.id : 'perro';
  });
  const [error, setError] = useState('');

  const handleAddPlayer = (e) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Por favor escribe un nombre.');
      return;
    }
    if (list.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya existe un jugador con ese nombre.');
      return;
    }

    const newPlayer = {
      id: Date.now().toString(),
      name: trimmed,
      gender: gender,
      animal: selectedAnimal,
    };

    const updatedList = [...list, newPlayer];
    setList(updatedList);
    setName('');
    setError('');

    // Sugerir automáticamente el siguiente animal no utilizado
    const usedAnimals = updatedList.map((p) => p.animal);
    const nextAvailable = ANIMAL_AVATARS.find((a) => !usedAnimals.includes(a.id));
    if (nextAvailable) {
      setSelectedAnimal(nextAvailable.id);
    }
  };

  const handleRemove = (id) => {
    setList(list.filter((p) => p.id !== id));
  };

  const handleFinish = () => {
    if (list.length < 2) {
      setError('Se necesitan al menos 2 jugadores para comenzar.');
      return;
    }
    onSavePlayers(list);
  };

  const currentAnimalObj = getAnimalAvatar(selectedAnimal);

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 py-3 pt-safe pb-safe flex flex-col justify-between min-h-dvh animate-in fade-in duration-200">
      <div>
        {/* Encabezado compacto */}
        <div className="text-center mb-3">
          <img
            src={logoImg}
            alt="Dando Jugo Logo"
            className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain drop-shadow mb-1"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-amber-400">
            {isFirstTime ? '¿QUIÉNES DAN JUGO?' : 'CONFIGURAR JUGADORES'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Elige tu nombre, género y tu Animal Ebrio
          </p>
        </div>

        {/* Formulario de agregar jugador */}
        <form onSubmit={handleAddPlayer} className="bg-[#161214]/90 border border-amber-900/40 rounded-3xl p-3.5 sm:p-5 shadow-xl mb-3">
          {/* Fila en Tablet: Nombre y Género en 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2.5">
            {/* 1. Nombre */}
            <div>
              <label className="block text-xs font-bold text-amber-200/70 mb-1 uppercase tracking-wide">
                Nombre o Apodo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ej: Diego, Vale, Camila..."
                maxLength={20}
                className="w-full bg-[#0c0a0b] border border-stone-800 rounded-2xl px-3.5 py-2 text-amber-50 placeholder-stone-600 font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
              />
            </div>

            {/* 2. Género */}
            <div>
              <label className="block text-xs font-bold text-amber-200/70 mb-1 uppercase tracking-wide">
                Género
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      gender === g.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : 'bg-[#0c0a0b] border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Selector de Animal Ebrio (4 cols en móvil, 8 cols en tablet/desktop) */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-200/70 uppercase tracking-wide">
                Tu Animal Ebrio: <span className="text-amber-400 font-black">{currentAnimalObj.name}</span>
              </label>
              <span className="text-[10px] sm:text-xs text-stone-400 italic">
                "{currentAnimalObj.phrase}"
              </span>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-2 bg-[#0c0a0b] rounded-2xl border border-stone-800">
              {ANIMAL_AVATARS.map((animal) => {
                const isSelected = selectedAnimal === animal.id;
                const isTaken = list.some((p) => p.animal === animal.id);
                return (
                  <button
                    type="button"
                    key={animal.id}
                    onClick={() => setSelectedAnimal(animal.id)}
                    className={`relative p-1.5 rounded-xl border transition flex flex-col items-center group ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/60 scale-105'
                        : isTaken
                        ? 'bg-[#161214]/40 border-stone-800 opacity-60'
                        : 'bg-[#161214] border-stone-800 hover:border-amber-700/60'
                    }`}
                  >
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-11 h-11 object-contain rounded-lg drop-shadow"
                    />
                    <span className="text-[10px] font-bold mt-1 text-stone-300 truncate w-full text-center">
                      {animal.name}
                    </span>
                    {isTaken && !isSelected && (
                      <span className="absolute top-1 right-1 text-[8px] bg-stone-800 text-stone-400 px-1 rounded-full">
                        ocupado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold mb-2">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#20181d] hover:bg-[#2b1f26] active:scale-98 text-amber-400 border border-amber-500/30 rounded-2xl font-black text-sm uppercase tracking-wide transition shadow"
          >
            ➕ Agregar Jugador
          </button>
        </form>

        {/* Lista de jugadores agregados */}
        <div className="space-y-2 max-h-[24vh] md:max-h-[32vh] overflow-y-auto custom-scrollbar pr-1">
          <div className="flex items-center justify-between text-xs text-amber-200/70 font-bold px-1 mb-1">
            <span>JUGADORES ({list.length})</span>
            {list.length < 2 && (
              <span className="text-amber-400 font-normal">Faltan {2 - list.length} más</span>
            )}
          </div>

          {list.length === 0 ? (
            <div className="p-3 rounded-2xl bg-[#161214]/50 border border-dashed border-stone-800 text-center text-xs text-stone-500 italic">
              Aún no hay jugadores añadidos. Llena los datos y pulsa "Agregar".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {list.map((player, index) => {
                const genderObj = GENDERS.find((g) => g.id === player.gender) || GENDERS[2];
                const animalObj = getAnimalAvatar(player.animal);
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 rounded-2xl bg-[#161214] border border-amber-900/30 shadow-sm animate-in slide-in-from-bottom-2 duration-150"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center text-xs font-black text-stone-500">
                        #{index + 1}
                      </span>
                      <img
                        src={animalObj.image}
                        alt={animalObj.name}
                        className="w-9 h-9 object-contain rounded-xl bg-[#0c0a0b] p-0.5 border border-amber-400/40 drop-shadow"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-amber-50">
                            {player.name}
                          </span>
                          <span className="text-xs">{genderObj.icon}</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-medium">
                          {animalObj.name} • {animalObj.phrase}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(player.id)}
                      className="text-stone-500 hover:text-rose-400 p-1.5 transition text-base"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Botón inferior para continuar */}
      <div className="mt-3 flex flex-col gap-2 max-w-md md:max-w-xl mx-auto w-full">
        <button
          onClick={handleFinish}
          disabled={list.length < 2}
          className={`w-full py-3.5 px-6 rounded-2xl font-display font-black text-base uppercase tracking-wider transition-all shadow-xl active:scale-98 ${
            list.length >= 2
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-amber-500/25 hover:brightness-105 border border-amber-300'
              : 'bg-stone-900 text-stone-600 cursor-not-allowed border border-stone-800'
          }`}
        >
          {isFirstTime ? '🚀 ¡Listo, Ir al Menú!' : '💾 Guardar y Volver'}
        </button>

        {!isFirstTime && onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-1.5 text-xs text-stone-400 hover:text-white font-bold transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
