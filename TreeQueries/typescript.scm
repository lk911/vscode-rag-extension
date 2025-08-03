(function_declaration) @chunk.function
(class_declaration) @chunk.class
(interface_declaration) @chunk.interface
(enum_declaration) @chunk.enum
; For extracting names:
(function_declaration name: (identifier) @name)
(class_declaration name: (identifier) @name)