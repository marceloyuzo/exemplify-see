// components/pdf/LessonPlanHtml.tsx
'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import React from 'react'
export interface LessonPlanPdfStep {
  id: string
  lessonPlanAnswerId: string
  title: string
  description: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface LessonPlanPdfAxis {
  axisTitle: string
  steps: LessonPlanPdfStep[]
}

export interface LessonPlanPdf {
  title: string
  approach: {
    title: string
  }
  description: string
  year: string
  workload: string
  subject: {
    title: string
  }
  topic: {
    title: string
  }
  complexity: string
  modality: string
  example: string
  priorKnowledge: string
  contents: string[]
  materials: string[]
  axes: LessonPlanPdfAxis[]
  complexityLabel: string | null
  exampleLabel: string | null
  modalityLabel: string | null
}

interface GeneratePdfProps {
  payload: LessonPlanPdf
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  container: {
    maxWidth: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleBullet: {
    width: 4,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionText: {
    fontSize: 10,
    lineHeight: 1.6,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  metadataItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    width: '48%',
    marginBottom: 10,
  },
  metadataLabel: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  metadataValue: {
    color: '#000000',
    fontSize: 10,
  },
  listSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    border: '1px solid #e5e7eb',
  },
  listItem: {
    fontSize: 10,
    paddingVertical: 4,
    paddingLeft: 12,
    position: 'relative',
    borderBottom: '1px solid #f3f4f6',
  },
  listItemLast: {
    borderBottom: 'none',
  },
  listItemBullet: {
    position: 'absolute',
    left: 0,
    top: 4,
    color: '#000000',
    fontWeight: 'bold',
  },
  axisSection: {
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
  },
  axisTitle: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  stepTitle: {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: 10,
    marginBottom: 10,
  },
  stepDescription: {
    color: '#000000',
    fontSize: 10,
    lineHeight: 1.6,
  },
  noSteps: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
    fontSize: 10,
  },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: 9,
  },
})

export default function LessonPlanHTML({ payload }: GeneratePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{payload.title}</Text>
            <Text style={styles.subtitle}>Plano de Aula Detalhado</Text>
            <Text style={styles.subtitle}>
              Abordagem {payload.approach.title}
            </Text>
          </View>

          {/* Description */}
          {payload.description && (
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionTitleBullet} />
                <Text>Descrição</Text>
              </View>
              <Text style={styles.sectionText}>{payload.description}</Text>
            </View>
          )}

          {/* General Information */}
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionTitleBullet} />
              <Text>Informações Gerais</Text>
            </View>
            <View style={styles.metadataGrid}>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Ano/Série</Text>
                <Text style={styles.metadataValue}>{payload.year}</Text>
              </View>

              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Carga Horária</Text>
                <Text style={styles.metadataValue}>
                  {payload.workload} horas
                </Text>
              </View>

              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Disciplina</Text>
                <Text style={styles.metadataValue}>
                  {payload.subject.title}
                </Text>
              </View>

              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Tema</Text>
                <Text style={styles.metadataValue}>{payload.topic.title}</Text>
              </View>

              {payload.complexityLabel && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Complexidade</Text>
                  <Text style={styles.metadataValue}>
                    {payload.complexityLabel}
                  </Text>
                </View>
              )}

              {payload.modalityLabel && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Modalidade</Text>
                  <Text style={styles.metadataValue}>
                    {payload.modalityLabel}
                  </Text>
                </View>
              )}

              {payload.exampleLabel && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Tipo de Exemplo</Text>
                  <Text style={styles.metadataValue}>
                    {payload.exampleLabel}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Prior Knowledge */}
          {payload.priorKnowledge && (
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionTitleBullet} />
                <Text>Conhecimentos Prévios</Text>
              </View>
              <Text style={styles.sectionText}>{payload.priorKnowledge}</Text>
            </View>
          )}

          {/* Contents */}
          {payload.contents && payload.contents.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionTitleBullet} />
                <Text>Conteúdos</Text>
              </View>
              <View style={styles.listSection}>
                {payload.contents.map((content, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemBullet}>•</Text>
                    <Text>{content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Materials */}
          {payload.materials && payload.materials.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionTitleBullet} />
                <Text>Materiais e Recursos</Text>
              </View>
              <View style={styles.listSection}>
                {payload.materials.map((material, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemBullet}>•</Text>
                    <Text>{material}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pedagogical Axes */}
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionTitleBullet} />
              <Text>Eixos Pedagógicos</Text>
            </View>
            {payload.axes && payload.axes.length > 0 ? (
              payload.axes.map((axis, index) => (
                <View key={index} style={styles.axisSection}>
                  <View style={styles.axisTitle}>
                    <View>
                      <Text style={{ color: 'white', fontSize: 8 }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text>{axis.axisTitle}</Text>
                  </View>
                  {axis.steps && axis.steps.length > 0 ? (
                    axis.steps.map((step, stepIndex) => (
                      <View key={stepIndex} style={styles.stepItem}>
                        <Text style={styles.stepTitle}>
                          {stepIndex + 1}. {step.title}
                        </Text>
                        {step.description && (
                          <Text style={styles.stepDescription}>
                            {step.description}
                          </Text>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noSteps}>
                      Nenhum passo encontrado para este eixo.
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noSteps}>Nenhum eixo encontrado.</Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              Gerado em{' '}
              {new Date().toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
