import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HipotekaSimulatzailea = () => {
  const [mailegua, setMailegua] = useState('');
  const [epea, setEpea] = useState('');
  const [interesa, setInteresa] = useState('');
  const [emaitza, setEmaitza] = useState(null);

  const formatNumber = (value) => {
    if (value === '') return '';
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    return number.toLocaleString('eu-ES', { maximumFractionDigits: 2, useGrouping: true });
  };

  const parseNumber = (value) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^\d,.-]/g, '');
    setter(value);
  };

  const kalkulatuHipoteka = () => {
    const maileguaValue = parseNumber(mailegua);
    const epeaValue = parseNumber(epea);
    const interesaValue = parseNumber(interesa);

    if (isNaN(maileguaValue) || isNaN(epeaValue) || isNaN(interesaValue)) {
      alert('Mesedez, bete eremu guztiak zenbaki baliozkoekin.');
      return;
    }

    const hilabetekoa = interesaValue / 12 / 100;
    const epeaHilabetetan = epeaValue * 12;
    const hileroOrdainketa = (maileguaValue * hilabetekoa * Math.pow(1 + hilabetekoa, epeaHilabetetan)) / (Math.pow(1 + hilabetekoa, epeaHilabetetan) - 1);
    const guztiraOrdaindutakoa = hileroOrdainketa * epeaHilabetetan;
    const interesak = guztiraOrdaindutakoa - maileguaValue;

    const amortizazioTaula = [];
    let geratzenDena = maileguaValue;
    for (let i = 1; i <= Math.min(epeaHilabetetan, 360); i++) {
      const interesOrdainketa = geratzenDena * hilabetekoa;
      const kapitalaOrdainketa = hileroOrdainketa - interesOrdainketa;
      geratzenDena -= kapitalaOrdainketa;
      amortizazioTaula.push({
        hilabetea: i,
        ordainketa: hileroOrdainketa,
        kapitala: kapitalaOrdainketa,
        interesak: interesOrdainketa,
        geratzenDena: geratzenDena
      });
    }

    setEmaitza({
      hileroOrdainketa,
      guztiraOrdaindutakoa,
      interesak,
      amortizazioTaula
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-t-lg">
        Hipoteka Simulatzailea
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mailegua (€)</label>
            <Input
              type="text"
              value={mailegua}
              onChange={handleInputChange(setMailegua)}
              className="w-full"
              placeholder="Adib: 200.000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Epea (urteak)</label>
            <Input
              type="text"
              value={epea}
              onChange={handleInputChange(setEpea)}
              className="w-full"
              placeholder="Adib: 30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interes tasa (%)</label>
            <Input
              type="text"
              value={interesa}
              onChange={handleInputChange(setInteresa)}
              className="w-full"
              placeholder="Adib: 3,5"
            />
          </div>
        </div>
        <Button onClick={kalkulatuHipoteka} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Kalkulatu
        </Button>
        {emaitza && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Emaitzak</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent>
                  <h4 className="font-medium">Hilero ordainketa</h4>
                  <p className="text-2xl font-bold">{emaitza.hileroOrdainketa.toLocaleString('eu-ES', { style: 'currency', currency: 'EUR' })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h4 className="font-medium">Guztira ordaindutakoa</h4>
                  <p className="text-2xl font-bold">{emaitza.guztiraOrdaindutakoa.toLocaleString('eu-ES', { style: 'currency', currency: 'EUR' })}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h4 className="font-medium">Interesak</h4>
                  <p className="text-2xl font-bold">{emaitza.interesak.toLocaleString('eu-ES', { style: 'currency', currency: 'EUR' })}</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Amortizazio Grafikoa</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={emaitza.amortizazioTaula}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hilabetea" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="kapitala" stroke="#8884d8" name="Kapitala" />
                  <Line type="monotone" dataKey="interesak" stroke="#82ca9d" name="Interesak" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HipotekaSimulatzailea;
