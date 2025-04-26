import React from "react";
import { characters } from "../data/characters";
import type { Character } from "../data/characters";

export function CharacterPopup({ character }: { character: Character }) {
  return (
    <div className="mt-8 mx-auto bg-white rounded-lg shadow-lg p-12 max-w-3xl flex flex-col items-center">
      <img
        src={character.imageSrc}
        alt={character.name}
        className="w-80 h-80 rounded-full object-cover border-4 border-gray-200 mb-6"
      />
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
        {character.name || "Navn Ukjent"}
      </h2>
      <p className="text-gray-700 text-center whitespace-pre-line">
        {character.description}
      </p>
      <span className="mt-2 text-base font-semibold text-gray-600">
        {character.role}
      </span>
    </div>
  );
}

export default function CharactersRow({
  onCharacterClick,
}: {
  onCharacterClick?: (character: Character) => void;
}) {
  return (
    <div className="bg-white inline-flex px-4 py-3 gap-4 rounded-lg shadow-md mx-auto">
      {characters.map((character) => (
        <div key={character.name} className="flex flex-col items-center">
          <button
            onClick={() => onCharacterClick && onCharacterClick(character)}
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200 shadow hover:shadow-lg transition-shadow focus:outline-none"
          >
            <img
              src={character.imageSrc}
              alt={character.name}
              className="object-cover w-full h-full"
            />
          </button>
          <span className="mt-2 text-sm font-medium text-gray-800">
            {character.name || "Navn Ukjent"}
          </span>
          <span className="text-xs text-gray-500">{character.role}</span>
        </div>
      ))}
    </div>
  );
}
