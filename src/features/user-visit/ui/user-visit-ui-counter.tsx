import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCounterQuery } from '../data-access/use-counter-query'
import { Users, Eye, CheckCircle } from 'lucide-react'

export function UserVisitUiCounter({
    onRecordVisit,
    isRecording,
    hasVisited,
    isConfirming = false
}: {
    onRecordVisit: () => void
    isRecording: boolean
    hasVisited?: boolean
    isConfirming?: boolean
}) {
    const { data: counter, isLoading } = useCounterQuery()

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Users className="w-6 h-6" />
                    Website Visit Counter
                </CardTitle>
                <CardDescription>
                    Record your visit to contribute to our community metrics
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Global Counter Display */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                        {isLoading ? '...' : Number(counter?.data.count ?? 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Unique Visits
                    </div>
                </div>

                {/* Visit Status */}
                {hasVisited && (
                    <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Visit Recorded!</span>
                    </div>
                )}

                {/* Record Visit Button */}
                {!hasVisited && (
                    <Button
                        onClick={onRecordVisit}
                        disabled={isRecording}
                        className="w-full"
                        size="lg"
                    >
                        {isRecording ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                {isConfirming ? 'Confirming Transaction...' : 'Recording Visit...'}
                            </>
                        ) : (
                            <>
                                <Eye className="w-5 h-5 mr-2" />
                                Record My Visit
                            </>
                        )}
                    </Button>
                )}

                {/* Verification Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">🔍 Verification</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                        <p>• Counter data is stored in account: <code className="bg-blue-100 px-1 rounded text-xs">{counter?.address ? `${counter.address.slice(0, 8)}...${counter.address.slice(-8)}` : 'Not initialized'}</code></p>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        <p>• Click "View Counter on Explorer" to see the raw blockchain data</p>
                        <p>• Each visit creates a permanent transaction record</p>
                    </div>
                </div>

                {/* Info Text */}
                <div className="text-xs text-muted-foreground text-center mt-3">
                    Each wallet can only record one visit. Data is stored on-chain and publicly verifiable.
                </div>
            </CardContent>
        </Card>
    )
}