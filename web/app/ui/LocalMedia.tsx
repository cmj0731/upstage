"use client";

import { useEffect, useState } from "react";
import { countryCoverImage, skkuLogoImage, universityCoverImage, universityLogoImage } from "../lib/media";

export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  const source = skkuLogoImage();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);

  if (!source || failed) return <span className={className}>S</span>;
  return <span className={`${className} has-image`}><img src={source} alt="성균관대학교 로고" onError={() => setFailed(true)} /></span>;
}

export function UniversityLogo({ name, className = "university-logo" }: { name: string; className?: string }) {
  const source = universityLogoImage(name);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);

  if (!source || failed) return null;
  return <img className={className} src={source} alt={`${name} 로고`} onError={() => setFailed(true)} />;
}

export function CountryCover({ name, className = "country-cover" }: { name: string; className?: string }) {
  const source = countryCoverImage(name);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);

  if (!source || failed) return null;
  return <img className={className} src={source} alt={`${name} 대표사진`} onError={() => setFailed(true)} />;
}

export function UniversityCover({
  name,
  fallback,
  className = "university-cover",
  onLoad,
}: {
  name: string;
  fallback?: string;
  className?: string;
  onLoad?: () => void;
}) {
  const source = universityCoverImage(name, fallback);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);

  if (!source || failed) return null;
  return <img className={className} src={source} alt={`${name} 대표사진`} onLoad={onLoad} onError={() => setFailed(true)} />;
}

export function UniversityCardMedia({ name, city, fallback, tone = 0 }: { name: string; city: string; fallback?: string; tone?: number }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [name, fallback]);

  return <div className={`card-visual visual-${tone % 3} ${loaded ? "has-photo" : ""}`}>
    <UniversityCover name={name} fallback={fallback} onLoad={() => setLoaded(true)} />
    <UniversityLogo name={name} className="card-university-logo" />
    {!loaded && <span>{city.slice(0, 1)}</span>}
    <small>{city}</small>
  </div>;
}
