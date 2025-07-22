-- Créer le trigger pour générer automatiquement les numéros de contrat
CREATE TRIGGER contract_number_trigger
BEFORE INSERT ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.generate_contract_number();