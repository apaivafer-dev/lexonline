import { Calendar, Clock, Video } from 'lucide-react';

export function SchedulingBlock() {
  return (
    <div className="w-full py-16 px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto text-center">
        <Calendar size={48} className="mx-auto mb-4 text-blue-600" />
        <h2 className="text-3xl font-bold mb-3 text-slate-900">Agende Sua Consultoria</h2>
        <p className="text-slate-600 mb-8">Escolha um horário disponível e fale com um de nossos especialistas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { Icon: Clock, label: 'Duração', value: '30 minutos' },
            { Icon: Video, label: 'Modalidade', value: 'Online ou Presencial' },
            { Icon: Calendar, label: 'Disponibilidade', value: 'Seg - Sáb' },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
              <Icon size={20} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">{label}</p>
              <p className="font-semibold text-slate-900 text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-8 border-2 border-blue-200 shadow-sm">
          <p className="text-slate-500 text-sm mb-4">Integração com Calendly ou Google Calendar</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((t) => (
              <button key={t} className="py-2 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-50 transition">{t}</button>
            ))}
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
}
