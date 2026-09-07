import React from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Calendar,
  Image as ImageIcon,
  FileText,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const cards = [
    {
      title: "News",
      desc: "Create and manage news articles.",
      to: "/news",
      actionLabel: "Manage news",
      icon: Newspaper,
    },
    {
      title: "Events",
      desc: "Manage event posts and details.",
      to: "/events",
      actionLabel: "Manage events",
      icon: Calendar,
    },
    {
      title: "Banners",
      desc: "Manage homepage banners.",
      to: "/banners",
      actionLabel: "Manage banners",
      icon: ImageIcon,
    },
    {
      title: "Newspapers",
      desc: "Upload and manage e-papers.",
      to: "/newspapers",
      actionLabel: "Manage e-papers",
      icon: FileText,
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Dashboard Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage your news, events, banners and e-papers.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="dashboard-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="dashboard-card-link"
              aria-label={`${card.title}: ${card.desc}`}
            >
              <div className="dashboard-card-top">
                <div className="dashboard-card-icon-wrap" aria-hidden="true">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="dashboard-card-text">
                  <h2 className="dashboard-card-title">{card.title}</h2>
                  <p className="dashboard-card-desc">{card.desc}</p>
                </div>
              </div>

              <div className="dashboard-card-action">
                <span>{card.actionLabel}</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
