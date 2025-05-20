import React from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const History = ({audits}) => {
  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">History & Note</h2>
      </div>
      <Table className="border-1">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Aksi</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.length > 0 ? (
            audits.map((audit, index) => (
              <TableRow key={audit.id}>
                <TableCell>{audit.created_at_formatted}</TableCell>
                <TableCell>{audit.event}</TableCell>
                <TableCell>{audit.user.name}</TableCell>
                <TableCell>{audit.note}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="text-center">
              <TableCell colSpan={4} className="py-4">
                Tidak ada data yang ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default History