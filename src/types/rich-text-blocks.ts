interface RichTextChild {
    type: "text";
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
  }
  
  interface ParagraphBlock {
    type: "paragraph";
    children: RichTextChild[];
  }
  
  interface HeadingBlock {
    type: "heading";
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: RichTextChild[];
  }
  
  interface ListBlock {
    type: "list";
    ordered: boolean;
    children: ListItemBlock[];
  }
  
  interface ListItemBlock {
    type: "list-item";
    children: RichTextChild[];
  }
  
  interface QuoteBlock {
    type: "quote";
    children: RichTextChild[];
  }
  
  interface CodeBlock {
    type: "code";
    language?: string;
    children: RichTextChild[];
  }
  
  interface ImageBlock {
    type: "image";
    url: string;
    caption?: string;
    alternativeText?: string;
  }
  
  interface TableBlock {
    type: "table";
    rows: TableRow[];
  }
  
  interface TableRow {
    type: "table-row";
    children: TableCell[];
  }
  
  interface TableCell {
    type: "table-cell";
    children: RichTextChild[];
  }
  
  type StrapiRichTextBlock =
    | ParagraphBlock
    | HeadingBlock
    | ListBlock
    | ListItemBlock
    | QuoteBlock
    | CodeBlock
    | ImageBlock
    | TableBlock;
  
  
  export type StrapiRichText = StrapiRichTextBlock[];
  